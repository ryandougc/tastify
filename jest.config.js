module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    // setupFiles: [
    //   "<rootDir>/tests/integration-tests/dotenv-config.ts"
    // ],
    testMatch: ["**/*.test.ts", "**/*.test.js"],
    testPathIgnorePatterns: ["./node_modules/", "./tests/", "./build/", "./delete-this-random-functions"],
    coveragePathIgnorePatterns: ["./tests/"],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    resetModules: false,
    runner: "groups",
};
