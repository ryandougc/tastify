/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFiles: [
  //   "<rootDir>/tests/integration-tests/dotenv-config.ts"
  // ],
  testMatch: ["**/**/*.test.ts"],
  modulePathIgnorePatterns: ["example"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  resetModules: true
}