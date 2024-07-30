/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testRegex: '\\.test\\.ts$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@a/(.*)$': '<rootDir>/src/components/base/atoms/$1',
        '^@m/(.*)$': '<rootDir>/src/components/base/molecules/$1',
        '^@o/(.*)$': '<rootDir>/src/components/base/organisms/$1',
        '^@cm/(.*)$': '<rootDir>/src-common/$1',
        '^@be/(.*)$': '<rootDir>/src-electron/backend/$1'
    }
};
