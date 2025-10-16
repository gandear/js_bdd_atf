// Generated from: src\features\api\edge-cases.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('API Edge Cases & Error Handling', () => {

  test('Handle request timeout gracefully', { tag: ['@api', '@edge-cases', '@negative', '@timeout'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('I attempt login with 500ms timeout', null, { apiClient, logger, testState }); 
    await Then('the request times out', null, { logger, testState }); 
    await And('timeout error is logged', null, { logger, testState }); 
  });

  test('Handle 429 Too Many Requests', { tag: ['@api', '@edge-cases', '@negative', '@rate-limit'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('I send 10 rapid login requests', null, { apiClient, logger, testState }); 
    await Then('at least one request returns 429', null, { logger, testState }); 
    await And('error suggests retry later', null, { logger, testState }); 
  });

  test('Handle malformed JSON response', { tag: ['@api', '@edge-cases', '@negative', '@malformed-response'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('the API returns invalid JSON', null, { apiClient, logger, testState }); 
    await Then('response parsing fails safely', null, { logger, testState }); 
    await And('error context is captured', null, { logger, testState }); 
  });

  test('Handle 500 server error', { tag: ['@api', '@edge-cases', '@negative', '@server-error'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('the API returns 500 error', null, { apiClient, logger, testState }); 
    await Then('error status is 500', null, { logger, testState }); 
    await And('error is logged with full context', null, { logger, testState }); 
    await And('test does not hang', null, { logger, testState }); 
  });

  test('Handle empty response body', { tag: ['@api', '@edge-cases', '@negative', '@empty-response'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('the API returns 204 with empty body', null, { apiClient, logger, testState }); 
    await Then('response is handled without parsing errors', null, { logger, testState }); 
    await And('status is 204', null, { logger, testState }); 
  });

  test('Handle network connection error', { tag: ['@api', '@edge-cases', '@negative', '@network-error'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('network connection is unavailable', null, { apiClient, logger, testState }); 
    await Then('request fails with network error', null, { logger, testState }); 
    await And('error is caught and logged', null, { logger, testState }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $runScenarioHooks, logger }) => $runScenarioHooks('before', { logger }));
test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, logger, page }) => $runScenarioHooks('after', { logger, page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\api\\edge-cases.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":["@api","@edge-cases","@negative","@timeout"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I attempt login with 500ms timeout","stepMatchArguments":[{"group":{"start":21,"value":"500","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the request times out","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And timeout error is logged","stepMatchArguments":[]}]},
  {"pwTestLine":12,"pickleLine":12,"tags":["@api","@edge-cases","@negative","@rate-limit"],"steps":[{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I send 10 rapid login requests","stepMatchArguments":[{"group":{"start":7,"value":"10","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then at least one request returns 429","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And error suggests retry later","stepMatchArguments":[]}]},
  {"pwTestLine":18,"pickleLine":18,"tags":["@api","@edge-cases","@negative","@malformed-response"],"steps":[{"pwStepLine":19,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When the API returns invalid JSON","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then response parsing fails safely","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And error context is captured","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":24,"tags":["@api","@edge-cases","@negative","@server-error"],"steps":[{"pwStepLine":25,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When the API returns 500 error","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then error status is 500","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"And error is logged with full context","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"And test does not hang","stepMatchArguments":[]}]},
  {"pwTestLine":31,"pickleLine":31,"tags":["@api","@edge-cases","@negative","@empty-response"],"steps":[{"pwStepLine":32,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When the API returns 204 with empty body","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"Then response is handled without parsing errors","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"And status is 204","stepMatchArguments":[]}]},
  {"pwTestLine":37,"pickleLine":37,"tags":["@api","@edge-cases","@negative","@network-error"],"steps":[{"pwStepLine":38,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When network connection is unavailable","stepMatchArguments":[]},{"pwStepLine":39,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then request fails with network error","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"And error is caught and logged","stepMatchArguments":[]}]},
]; // bdd-data-end