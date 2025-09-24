// Generated from: src\features\ui\login_negative.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('Login with Invalid or Missing Credentials', () => {

  test.beforeEach('Background', async ({ Given, log, loginPage }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the OrangeHRM login page', null, { log, loginPage }); 
  });
  
  test.describe('Login attempt with invalid or missing credentials', () => {

    test('Example #1', { tag: ['@ui', '@login', '@negative'] }, async ({ When, Then, log, loginPage }) => { 
      await When('I log in with username "Admin" and password "123"', null, { log, loginPage }); 
      await Then('I should see the error message "Invalid credentials"', null, { log, loginPage }); 
    });

    test('Example #2', { tag: ['@ui', '@login', '@negative'] }, async ({ When, Then, log, loginPage }) => { 
      await When('I log in with username "invalid" and password "admin123"', null, { log, loginPage }); 
      await Then('I should see the error message "Invalid credentials"', null, { log, loginPage }); 
    });

    test('Example #3', { tag: ['@ui', '@login', '@negative'] }, async ({ When, Then, log, loginPage }) => { 
      await When('I log in with username "" and password "admin123"', null, { log, loginPage }); 
      await Then('I should see the error message "Required"', null, { log, loginPage }); 
    });

    test('Example #4', { tag: ['@ui', '@login', '@negative'] }, async ({ When, Then, log, loginPage }) => { 
      await When('I log in with username "Admin" and password ""', null, { log, loginPage }); 
      await Then('I should see the error message "Required"', null, { log, loginPage }); 
    });

    test('Example #5', { tag: ['@ui', '@login', '@negative'] }, async ({ When, Then, log, loginPage }) => { 
      await When('I log in with username "" and password ""', null, { log, loginPage }); 
      await Then('I should see the error message "Required"', null, { log, loginPage }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\ui\\login_negative.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":12,"pickleLine":17,"tags":["@ui","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the OrangeHRM login page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I log in with username \"Admin\" and password \"123\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Admin\"","children":[{"start":24,"value":"Admin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"123\"","children":[{"start":45,"value":"123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see the error message \"Invalid credentials\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Invalid credentials\"","children":[{"start":32,"value":"Invalid credentials","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":17,"pickleLine":18,"tags":["@ui","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the OrangeHRM login page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I log in with username \"invalid\" and password \"admin123\"","stepMatchArguments":[{"group":{"start":23,"value":"\"invalid\"","children":[{"start":24,"value":"invalid","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":46,"value":"\"admin123\"","children":[{"start":47,"value":"admin123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see the error message \"Invalid credentials\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Invalid credentials\"","children":[{"start":32,"value":"Invalid credentials","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":22,"pickleLine":19,"tags":["@ui","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the OrangeHRM login page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I log in with username \"\" and password \"admin123\"","stepMatchArguments":[{"group":{"start":23,"value":"\"\"","children":[{"start":24,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":39,"value":"\"admin123\"","children":[{"start":40,"value":"admin123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see the error message \"Required\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Required\"","children":[{"start":32,"value":"Required","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":27,"pickleLine":20,"tags":["@ui","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the OrangeHRM login page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I log in with username \"Admin\" and password \"\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Admin\"","children":[{"start":24,"value":"Admin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"\"","children":[{"start":45,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see the error message \"Required\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Required\"","children":[{"start":32,"value":"Required","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":32,"pickleLine":21,"tags":["@ui","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the OrangeHRM login page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I log in with username \"\" and password \"\"","stepMatchArguments":[{"group":{"start":23,"value":"\"\"","children":[{"start":24,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":39,"value":"\"\"","children":[{"start":40,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then I should see the error message \"Required\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Required\"","children":[{"start":32,"value":"Required","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end