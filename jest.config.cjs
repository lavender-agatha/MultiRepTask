module.exports = {
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(mjs|jsx?|js?|tsx?|ts?)$",
    transform: {
      "^.+\\.jsx?$": "babel-jest",
      "^.+\\.mjs$": "babel-jest",
    },
    testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
    moduleFileExtensions: ["js", "jsx", "mjs"],
    roots: [
      "<rootDir>/test/",
      //"<rootDir>/test/utils",
      //"<rootDir>/test/canvascontents",
    ],
    testEnvironment: 'jsdom',
  };