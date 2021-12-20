// i18next-parser.config.js

module.exports = {
  defaultValue: "__STRING_NOT_TRANSLATED__",
  // Default value to give to empty keys
  // You may also specify a function accepting the locale, namespace, and key as arguments

  input: ["src/**/*.ts", "src/**/*.tsx"],

  keepRemoved: false,
  // Keep keys from the catalog that are no longer in code

  keySeparator: ".",
  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

  locales: ["en"],
  // An array of the locales in your applications

  output: "src/fallbackTranslations/$NAMESPACE.json",

  sort: true,
  // Whether or not to sort the catalog. Can also be a [compareFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters)
};
