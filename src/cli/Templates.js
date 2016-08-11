import handlebars from 'handlebars';

const translation = `{{toJSON this}}`;
export const TRANSLATION = handlebars.compile(translation);

handlebars.registerHelper('toJSON', function(object) {
    return new handlebars.SafeString(JSON.stringify(object, null, 4));
});
