import marked from 'marked';
import chalk from 'chalk';

let renderer = new marked.Renderer();
marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true
});

renderer.code = (code) => {
    return chalk.inverse.green(code) + '\n\n'; //eslint-disable-line
};

renderer.blockquote = (quote) => {
    return chalk.bgBlack(quote);
};

renderer.html = (html) => {
    return html;
};

renderer.heading = (text, level) => {
    if (level === 1) {
        return '\n' + chalk.bold.underline(text) + '\n\n'; //eslint-disable-line
    }

    return chalk.underline(text) + '\n\n'; //eslint-disable-line
};

renderer.hr = () => {
    return chalk.underline(Array(80).join(' ')) + '\n\n\n'; //eslint-disable-line
};

renderer.list = (body) => {
    return body;
};

renderer.listitem = (text) => {
    return text;
};

renderer.paragraph = (text) => {
    return text + '\n\n'; //eslint-disable-line
};

renderer.table = () => {
    return '\n'; //eslint-disable-line
};

renderer.tablerow = () => {
    return '';
};

renderer.tablecell = () => {
  // flags has the following properties:
  //
  // {
  //   header: true || false,
  //   align: 'center' || 'left' || 'right'
  // }
    return '';
};

// Inline Level Methods
renderer.strong = (text) => {
    return chalk.bold(text);
};

renderer.em = (text) => {
    return chalk.yellow.bold(text);
};

renderer.codespan = (code) => {
    return chalk.inverse(code);
};

renderer.br = () => {
    return '\n'; //eslint-disable-line
};

renderer.del = (text) => {
    return chalk.strikethrough(text);
};

renderer.link = (text) => {
    return text;
};

renderer.image = () => {
    return '';
};

export default (text) => {
    return marked(text, { renderer: renderer });
};
