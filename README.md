<img src="bully.png" align="right" width="100" />
# linguist  [![Build Status](https://travis-ci.org/bullhorn/linguist.svg?branch=master)](https://travis-ci.org/bullhorn/linguist) [![Coverage Status](https://coveralls.io/repos/bullhorn/linguist/badge.svg?branch=master)](https://coveralls.io/r/bullhorn/linguist?branch=master)

> A CLI to help manage localization files

## Installation

```npm install -g @bullhorn/linguist```

## Configuration

Setup you `.linguistrc` file

```
{
    locale: 'en-US',          // default locale used for translations
    sources: ['./src'],       // list of directories to search for KEYS.
    dest: './l10n',           // where localization files are stored
    patterns: [               // file patterns to look for keys in
        '/**/*.html',
        '/**/*.ts'
    ],
    prefix: 'messages.',      // file prefix for saving localization files
    format: 'json',           // localization file format, ie. json, namespaced-json, pot, xliff, xliff2
    verbose: false,           // display extra information in console
    replace: false,           // replace existing translations when extraction keys
    clean: false,             // removed unused keys when extracting new keys
    keys: []                  // Extra regular expression to be used by the parser
}
```

## Usage

### Finding all the translations within your project files

>  linguist check [lang]

```
Usage: check [options] [lang]

Check for missing translation keys

Options:
    -h, --help               output usage information
    -s, --sources [sources]  specify source directories.
    -d, --dest <dest>        specify output directory.
    -v, --verbose            list all keys found.
```

```
$ linguist check en-US
+ Custom keys found, adding regular expression parser
✔︎ Extracted 109 strings from '/Projects/test/js'
✔︎ Extracted 349 strings from '/Projects/test/partials'
✔︎ Extracted 237 strings from '/Projects/test/node_modules/package'
* Loaded Control file
✔︎ 515 existing keys found
✗ Missing 105 keys
✗ Found 72 unused keys
```

### Updating you control language file with all keys

> linguist extract [lang]

```
Usage: extract [options] [lang]

Updates translation file with missing keys

Options:
    -h, --help               output usage information
    -s, --sources [sources]  specify source directories.
    -d, --dest <dest>        specify lang directory.
    -f, --format <format>    specify output format. (json, xliff, pot)
    -r, --replace            Replace the contents of output file if it exists (Merges by default).
    -c, --clean              Remove obsolete strings when merging.
```

``` 
$ linguist extract en-US
⠴ extracting...
✔︎ Extracted 100 strings from '/Projects/test/src'
✔︎ Saved to ./shared/i18n/de.json
```

### Translating you control language

> linguist translate [lang]

```
Usage: translate [options] [lang]

Translate source file to new language

Options:
    -h, --help             output usage information
    -d, --dest <dest>      specify localization resources directory.
    -f, --format <format>  specify output format. (json, xliff)
```

```
$ linguist translate de-DE
* Loaded Control file
✔︎ 1026 existing keys found
✗ Missing 352 translations
⠧ translating...350 of 352
✔︎ Saved to './shared/i18n/de-DE.json'
```

### Convert

> linguist convert [lang] [to]

```
Usage: convert [options] [lang] [to]

Convert translations to new format

Options:
    -h, --help             output usage information
    -d, --dest <dest>      specify localization resources directory.
    -f, --format <format>  specify output format. (json, xliff)
```

```
$ linguist convert -f xliff de-DE
* Loaded Control file
✔︎ Saved to './shared/i18n/de-DE.xlf'
```

### Testing

To run all the unit tests, simply run:

> yarn test

