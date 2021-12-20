module.exports = {
  // results in less changed lines when items/entries are added
  trailingComma: "all",
  // https://github.com/trivago/prettier-plugin-sort-imports#readme
  // just a little bit more
  printWidth: 88,
  importOrder: ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
