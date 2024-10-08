/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { diagnostics: { ignoreCodes: ["TS151001"] } }],
  },
}
