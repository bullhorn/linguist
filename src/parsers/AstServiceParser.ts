import { AbstractTemplateParser } from './AbstractTemplateParser';
import { Parser } from './Parser';
import { Translations } from '../utils/Translations';
import { syntaxKindToName } from '../utils/Utils';

import * as ts from 'typescript';

export class AstServiceParser extends AbstractTemplateParser implements Parser {

	protected _sourceFile: ts.SourceFile;
	protected _instancePropertyName: any;
	protected _serviceClassName: string = 'TranslateService';
	protected _serviceMethodNames: string[] = ['get', 'instant'];

	public extract (contents: string, path: string): Translations {
		let collection: Translations = new Translations();
		this._sourceFile = this._createSourceFile(path, contents);
		this._instancePropertyName = this._getInstancePropertyName();
		if (!this._instancePropertyName) {
			return collection;
		}
		const callNodes = this._findCallNodes();
		callNodes.forEach(callNode => {
			const keys: string[] = this._getCallArgStrings(callNode);
			if (keys && keys.length) {
				collection = collection.addKeys(keys);
			}
		});

		return collection;
	}

	protected _createSourceFile (path: string, contents: string): ts.SourceFile {
		return ts.createSourceFile(path, contents, ts.ScriptTarget.ES2015, /*setParentNodes */ false);
	}

	/**
	 * Detect what the TranslateService instance property
	 * is called by inspecting constructor params
	 */
	protected _getInstancePropertyName (): string | boolean {
		const constructorNode = this._findConstructorNode();
		let result;
		if (constructorNode) {
			result = constructorNode.parameters.find(parameter => {
				// Skip if visibility modifier is not present (we want it set as an instance property)
				if (!parameter.modifiers) {
					return false;
				}

				// Make sure className is of the correct type
				const className: string = ((parameter.type as ts.TypeReferenceNode).typeName as ts.Identifier).text;
				if (className !== this._serviceClassName) {
					return false;
				}

				return true;
			});
		}

		if (result) {
			return (result.name as ts.Identifier).text;
		}
		return false;
	}

	/**
	 * Find first constructor
	 */
	protected _findConstructorNode (): ts.ConstructorDeclaration | undefined {
		const constructors = this._findNodes(this._sourceFile, ts.SyntaxKind.Constructor, true) as ts.ConstructorDeclaration[];
		if (constructors.length) {
			return constructors[0];
		}
		return;
	}

	/**
	 * Find all calls to TranslateService methods
	 */
	protected _findCallNodes (node?: ts.Node): ts.CallExpression[] {
		if (!node) {
			node = this._sourceFile;
		}

		let callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression) as ts.CallExpression[];
		callNodes = callNodes
			// Only call expressions with arguments
			.filter(callNode => callNode.arguments.length > 0)
			// More filters
			.filter(callNode => {
				const propAccess = callNode.getChildAt(0).getChildAt(0) as ts.PropertyAccessExpression;
				if (!propAccess || propAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
					return false;
				}
				if (!propAccess.getFirstToken() || propAccess.getFirstToken().kind !== ts.SyntaxKind.ThisKeyword) {
					return false;
				}
				if (propAccess.name.text !== this._instancePropertyName) {
					return false;
				}

				const methodAccess = callNode.getChildAt(0) as ts.PropertyAccessExpression;
				if (!methodAccess || methodAccess.kind !== ts.SyntaxKind.PropertyAccessExpression) {
					return false;
				}
				if (!methodAccess.name || this._serviceMethodNames.indexOf(methodAccess.name.text) === -1) {
					return false;
				}

				return true;
			});

		return callNodes;
	}

	/**
	 * Get strings from function call's first argument
	 */
	protected _getCallArgStrings (callNode: ts.CallExpression): string[] {
		if (!callNode.arguments.length) {
			return [];
		}

		const firstArg = callNode.arguments[0];
		switch (firstArg.kind) {
			case ts.SyntaxKind.StringLiteral:
			case ts.SyntaxKind.FirstTemplateToken:
				return [(firstArg as ts.StringLiteral).text];
			case ts.SyntaxKind.ArrayLiteralExpression:
				return (firstArg as ts.ArrayLiteralExpression).elements
					.map((element: ts.StringLiteral) => element.text);
			case ts.SyntaxKind.Identifier:
				console.log('WARNING: We cannot extract variable values passed to TranslateService (yet)');
				break;
			default:
				console.log(`SKIP: Unknown argument type: '${syntaxKindToName(firstArg.kind)}'`, firstArg);
		}
		return [];
	}

	/**
	 * Find all child nodes of a kind
	 */
	protected _findNodes (node: ts.Node, kind: ts.SyntaxKind, onlyOne: boolean = false): ts.Node[] {
		if (node.kind === kind && onlyOne) {
			return [node];
		}

		const childrenNodes: ts.Node[] = node.getChildren(this._sourceFile);
		const initialValue: ts.Node[] = node.kind === kind ? [node] : [];

		return childrenNodes.reduce((result: ts.Node[], childNode: ts.Node) => {
			return result.concat(this._findNodes(childNode, kind));
		}, initialValue);
	}
}
