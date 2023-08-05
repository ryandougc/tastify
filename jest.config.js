module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    // setupFiles: [
    //   "<rootDir>/tests/integration-tests/dotenv-config.ts"
    // ],
    testMatch: ["**/*.test.ts", "**/*.test.js"],
    testPathIgnorePatterns: ["./node_modules/", "./build/", "/dist/", "./old-code"],
    coveragePathIgnorePatterns: [],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    resetModules: false,
    runner: "groups",
};
