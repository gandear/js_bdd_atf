// Generated from: src\features\api\auth.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('Auth API', () => {

  test.describe('Register with valid creds', () => {

    test('Example #1', { tag: ['@api', '@auth', '@positive', '@register'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I register with email "eve.holt@reqres.in" and password "pistol"', null, { apiClient, apiState, log }); 
      await Then('registration succeeds', null, { apiState, log }); 
    });

  });

  test.describe('Register with invalid creds', () => {

    test('Example #1', { tag: ['@api', '@auth', '@negative', '@register'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I register with email "sydney@fife" and password ""', null, { apiClient, apiState, log }); 
      await Then('registration fails with an error', null, { apiState, log }); 
    });

    test('Example #2', { tag: ['@api', '@auth', '@negative', '@register'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I register with email "invalid-email" and password "pass"', null, { apiClient, apiState, log }); 
      await Then('registration fails with an error', null, { apiState, log }); 
    });

    test('Example #3', { tag: ['@api', '@auth', '@negative', '@register'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I register with email "" and password "pass"', null, { apiClient, apiState, log }); 
      await Then('registration fails with an error', null, { apiState, log }); 
    });

  });

  test.describe('Login with valid creds', () => {

    test('Example #1', { tag: ['@api', '@auth', '@positive', '@login'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I login with email "eve.holt@reqres.in" and password "cityslicka"', null, { apiClient, apiState, log }); 
      await Then('login succeeds', null, { apiState, log }); 
    });

  });

  test.describe('Login with invalid creds', () => {

    test('Example #1', { tag: ['@api', '@auth', '@negative', '@login'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I login with email "" and password "pass"', null, { apiClient, apiState, log }); 
      await Then('login fails with an error', null, { apiState, log }); 
    });

    test('Example #2', { tag: ['@api', '@auth', '@negative', '@login'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I login with email "user@test.com" and password ""', null, { apiClient, apiState, log }); 
      await Then('login fails with an error', null, { apiState, log }); 
    });

    test('Example #3', { tag: ['@api', '@auth', '@negative', '@login'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I login with email "bad@" and password "secret"', null, { apiClient, apiState, log }); 
      await Then('login fails with an error', null, { apiState, log }); 
    });

  });

  test('Authenticate and keep token in client', { tag: ['@api', '@auth', '@session'] }, async ({ When, Then, apiClient, apiState }) => { 
    await When('I authenticate with valid credentials', null, { apiClient, apiState }); 
    await Then('the client holds a bearer token', null, { apiClient, apiState }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\api\\auth.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":11,"tags":["@api","@auth","@positive","@register"],"steps":[{"pwStepLine":9,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I register with email \"eve.holt@reqres.in\" and password \"pistol\"","stepMatchArguments":[{"group":{"start":22,"value":"\"eve.holt@reqres.in\"","children":[{"start":23,"value":"eve.holt@reqres.in","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":56,"value":"\"pistol\"","children":[{"start":57,"value":"pistol","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then registration succeeds","stepMatchArguments":[]}]},
  {"pwTestLine":17,"pickleLine":19,"tags":["@api","@auth","@negative","@register"],"steps":[{"pwStepLine":18,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I register with email \"sydney@fife\" and password \"\"","stepMatchArguments":[{"group":{"start":22,"value":"\"sydney@fife\"","children":[{"start":23,"value":"sydney@fife","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":49,"value":"\"\"","children":[{"start":50,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then registration fails with an error","stepMatchArguments":[]}]},
  {"pwTestLine":22,"pickleLine":20,"tags":["@api","@auth","@negative","@register"],"steps":[{"pwStepLine":23,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I register with email \"invalid-email\" and password \"pass\"","stepMatchArguments":[{"group":{"start":22,"value":"\"invalid-email\"","children":[{"start":23,"value":"invalid-email","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":51,"value":"\"pass\"","children":[{"start":52,"value":"pass","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then registration fails with an error","stepMatchArguments":[]}]},
  {"pwTestLine":27,"pickleLine":21,"tags":["@api","@auth","@negative","@register"],"steps":[{"pwStepLine":28,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I register with email \"\" and password \"pass\"","stepMatchArguments":[{"group":{"start":22,"value":"\"\"","children":[{"start":23,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":38,"value":"\"pass\"","children":[{"start":39,"value":"pass","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then registration fails with an error","stepMatchArguments":[]}]},
  {"pwTestLine":36,"pickleLine":30,"tags":["@api","@auth","@positive","@login"],"steps":[{"pwStepLine":37,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I login with email \"eve.holt@reqres.in\" and password \"cityslicka\"","stepMatchArguments":[{"group":{"start":19,"value":"\"eve.holt@reqres.in\"","children":[{"start":20,"value":"eve.holt@reqres.in","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":53,"value":"\"cityslicka\"","children":[{"start":54,"value":"cityslicka","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"Then login succeeds","stepMatchArguments":[]}]},
  {"pwTestLine":45,"pickleLine":38,"tags":["@api","@auth","@negative","@login"],"steps":[{"pwStepLine":46,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When I login with email \"\" and password \"pass\"","stepMatchArguments":[{"group":{"start":19,"value":"\"\"","children":[{"start":20,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":35,"value":"\"pass\"","children":[{"start":36,"value":"pass","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":47,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then login fails with an error","stepMatchArguments":[]}]},
  {"pwTestLine":50,"pickleLine":39,"tags":["@api","@auth","@negative","@login"],"steps":[{"pwStepLine":51,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When I login with email \"user@test.com\" and password \"\"","stepMatchArguments":[{"group":{"start":19,"value":"\"user@test.com\"","children":[{"start":20,"value":"user@test.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":48,"value":"\"\"","children":[{"start":49,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":52,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then login fails with an error","stepMatchArguments":[]}]},
  {"pwTestLine":55,"pickleLine":40,"tags":["@api","@auth","@negative","@login"],"steps":[{"pwStepLine":56,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"When I login with email \"bad@\" and password \"secret\"","stepMatchArguments":[{"group":{"start":19,"value":"\"bad@\"","children":[{"start":20,"value":"bad@","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":39,"value":"\"secret\"","children":[{"start":40,"value":"secret","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":57,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then login fails with an error","stepMatchArguments":[]}]},
  {"pwTestLine":62,"pickleLine":44,"tags":["@api","@auth","@session"],"steps":[{"pwStepLine":63,"gherkinStepLine":45,"keywordType":"Action","textWithKeyword":"When I authenticate with valid credentials","stepMatchArguments":[]},{"pwStepLine":64,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"Then the client holds a bearer token","stepMatchArguments":[]}]},
]; // bdd-data-end