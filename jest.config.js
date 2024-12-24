/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@appflowy-chat/(.*)$': '<rootDir>/src/chat/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
