// Generated from: src\features\api\create_users.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('Create users from DataTable', () => {

  test('Create multiple users via DataTable', { tag: ['@smoke', '@users'] }, async ({ When, Then, logger, testDataManager, testState }) => { 
    await When('I create users from table', {"dataTable":{"rows":[{"cells":[{"value":"name"},{"value":"job"},{"value":"email"}]},{"cells":[{"value":"Alice QA"},{"value":"Tester"},{"value":"alice.qa@example.com"}]},{"cells":[{"value":"Bob Dev"},{"value":"Dev"},{"value":"bob.dev@example.com"}]}]}}, { logger, testDataManager, testState }); 
    await Then('the table users are created', null, { testState }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $runScenarioHooks, logger, testInfo }) => $runScenarioHooks('before', { logger, testInfo }));
test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, logger, page, testInfo }) => $runScenarioHooks('after', { logger, page, testInfo }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\api\\create_users.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":["@smoke","@users"],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Action","textWithKeyword":"When I create users from table","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then the table users are created","stepMatchArguments":[]}]},
]; // bdd-data-end