// src/fixtures/testinfo.fixture.js
// expune testInfo ca fixture "normală"
export const testInfoFixture = {
  testInfo: [async ({}, use, testInfo) => {
    await use(testInfo);
  }, { scope: 'test' }],
};
