// Generated from: src\features\ui\login_positive.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('Login with Valid Credentials', () => {

  test.beforeEach('Background', async ({ Given, logger, loginPage }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the OrangeHRM login page', null, { logger, loginPage }); 
  });
  
  test('Login with valid credentials', { tag: ['@ui', '@login', '@positive'] }, async ({ When, Then, dashboardPage, logger, loginPage }) => { 
    await When('I log in with username "Admin" and password "admin123"', null, { logger, loginPage }); 
    await Then('I should see the dashboard', null, { dashboardPage }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $runScenarioHooks, logger, testInfo }) => $runScenarioHooks('before', { logger, testInfo }));
test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, logger, page, testInfo }) => $runScenarioHooks('after', { logger, page, testInfo }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\ui\\login_positive.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":11,"tags":["@ui","@login","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the OrangeHRM login page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I log in with username \"Admin\" and password \"admin123\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Admin\"","children":[{"start":24,"value":"Admin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"admin123\"","children":[{"start":45,"value":"admin123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see the dashboard","stepMatchArguments":[]}]},
]; // bdd-data-end