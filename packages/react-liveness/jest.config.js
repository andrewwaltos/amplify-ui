module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.(ts|tsx)'],
  // ignore coverage for top level "export", version and style files
  coveragePathIgnorePatterns: ['<rootDir>/src/(index|styles|version).(ts|tsx)'],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 76,
      lines: 77,
      statements: 78,
    },
  },
  globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } },
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
};
