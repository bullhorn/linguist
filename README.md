<img src="bully.png" align="right" width="100" />

# linguist

> A CLI to help manage localization files

### Installation

```npm install -g @bullhorn/linguist```

### Configuration
```json
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

### Usage

linguist check [lang]

```
Usage: check [options] [lang]

Check for missing translation keys

Options:
    -h, --help               output usage information
    -s, --sources [sources]  specify source directories.
    -d, --dest <dest>        specify output directory.
    -v, --verbose            list all keys found.
```

Sample output:

```
>  linguist check en-US
+ Custom keys found, adding regular expression parser
✔︎ Extracted 109 strings from '/Projects/test/js'
✔︎ Extracted 349 strings from '/Projects/test/partials'
✔︎ Extracted 237 strings from '/Projects/test/node_modules/package'
* Loaded Control file
✔︎ 515 existing keys found
✗ Missing 105 keys
✗ Found 72 unused keys
```

linguist extract [lang]

``` 
>  linguist extract en-US
⠴ extracting...
✔︎ Extracted 100 strings from '/Projects/test/src'
✔︎ Saved to ./shared/i18n/de.json
```

linguist translate [from]

```
>  linguist translate de-DE
// found 328 keys
⠴ translating...
translated 328 keys
file written to ./shared/i18n/de-DE.json
```

### Configuration

setup you .linguistrc file
```
{
    "locale": "en-US",
    "source": "./*/public/**/*.@(js|html)",
    "dest": "./shared/i18n",
    "keys": [
        "{{[^']*[']([^|]+)['][^']*\\s*\\|\\s*translate.*}}",
        "<[^>]*translate[^>]*>([^<]*)"
    ]
}
```
