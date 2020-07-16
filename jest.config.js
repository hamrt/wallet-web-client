module.exports = {
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: [
    "**/?(*.)+(spec|test).+(ts|tsx|js|jsx)",
    "**/tests/*.+(spec|test).+(ts|tsx|js|jsx)",
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
    "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
    ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/fileTransformer.js",
  },
  setupFiles: ["raf/polyfill"],
  coverageDirectory: "./coverage/",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/config/env.js",
    "!src/index.js",
    "!src/**/*.d.ts",
    "!**/node_modules/**",
    "!src/test/mocks/**",
  ],
  collectCoverage: true,
  reporters: ["default", "jest-sonar"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
};
