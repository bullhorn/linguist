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

renderer.code = function (code) {
  return chalk.inverse.green(code) + '\n\n';
};

renderer.blockquote = function (quote) {
  return chalk.bgBlack(quote);
};

renderer.html = function (html) {
  return html;
};

renderer.heading = function (text, level) {
  if (level == 1) {
    return '\n' + chalk.bold.underline(text) + '\n\n';
  } else {
    return chalk.underline(text) + '\n\n';
  }
};

renderer.hr = function () {
  return chalk.underline(Array(80).join(' ')) + '\n\n\n';
};

renderer.list = function (body) {
  return body;
};

renderer.listitem = function (text) {
  return text;
};

renderer.paragraph = function (text) {
  return text + '\n\n';
};

renderer.table = function () {
  return '\n';
};

renderer.tablerow = function () {
  return '';
};

renderer.tablecell = function () {
  // flags has the following properties:
  //
  // {
  //   header: true || false,
  //   align: 'center' || 'left' || 'right'
  // }
  return '';
};

// Inline Level Methods
renderer.strong = function (text) {
  return chalk.bold(text);
};

renderer.em = function (text) {
  return chalk.yellow.bold(text);
};

renderer.codespan = function (code) {
  return chalk.inverse(code);
};

renderer.br = function () {
  return '\n';
};

renderer.del = function (text) {
  return chalk.strikethrough(text);
};

renderer.link = function (text) {
  return text;
};

renderer.image = function () {
  return '';
};

export default function(text){
    return marked (text, {renderer: renderer});
}
