const errorLevel = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ['react-hooks', 'prefer-arrow', '@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      errorLevel,
      {
        'ts-ignore': 'allow-with-description',
        minimumDescriptionLength: 10
      }
    ],
    '@typescript-eslint/no-explicit-any': errorLevel,
    'import/order': [
      errorLevel,
      {
        groups: [['builtin', 'external'], 'internal', 'parent', ['sibling', 'index']],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'internal',
            pattern: '@master/**',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc' }
      }
    ],
    'prettier/prettier': errorLevel,
    'react/display-name': 'off',
    'sort-imports': [
      errorLevel,
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true
      }
    ]
  }
};
