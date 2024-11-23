export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.mjs',
    '^@mui/icons-material/Check$': '<rootDir>/__mocks__/CheckIconMock.tsx'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      useESM: true,
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@mui/material|@mui/system|@mui/icons-material|@emotion|framer-motion)/)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  }
}; 