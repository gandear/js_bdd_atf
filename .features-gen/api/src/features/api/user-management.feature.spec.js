// Generated from: src\features\api\user-management.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('User Management (API)', () => {

  test.beforeEach('Background', async ({ Given, api, logger }, testInfo) => { if (testInfo.error) return;
    await Given('I am logged in as a valid user', null, { api, logger }); 
  });
  
  test.describe('List users for a specific page', () => {

    test('Example #1', { tag: ['@api', '@users', '@read', '@public'] }, async ({ When, Then, And, api }) => { 
      await When('I send an unauthenticated GET request to "/api/users?page=1"', null, { api }); 
      await Then('the HTTP response is 200', null, { api }); 
      await And('the response contains correct pagination metadata for page 1', null, { api }); 
    });

    test('Example #2', { tag: ['@api', '@users', '@read', '@public'] }, async ({ When, Then, And, api }) => { 
      await When('I send an unauthenticated GET request to "/api/users?page=2"', null, { api }); 
      await Then('the HTTP response is 200', null, { api }); 
      await And('the response contains correct pagination metadata for page 2', null, { api }); 
    });

  });

  test('Create a new user with valid data', { tag: ['@api', '@users', '@write', '@create', '@positive'] }, async ({ When, Then, And, api }) => { 
    await When('I create a new user with name "Morpheus" and job "Leader"', null, { api }); 
    await Then('the HTTP response is 201', null, { api }); 
    await And('the response contains the name "Morpheus" and job "Leader"', null, { api }); 
    await And('the response contains a newly generated user ID', null, { api }); 
  });

  test('Delete an existing user (Requires Auth)', { tag: ['@api', '@users', '@write', '@delete', '@secure'] }, async ({ When, Then, And, api }) => { 
    await When('I send an authenticated DELETE request to "/api/users/2"', null, { api }); 
    await Then('the HTTP response is 204', null, { api }); 
    await And('the response has no content', null, { api }); 
  });

  test('Update an existing user (PUT)', { tag: ['@api', '@users', '@write', '@update', '@positive', '@secure'] }, async ({ Given, When, Then, And, api }) => { 
    await Given('a user with name "Neo" and job "The One" is created', null, { api }); 
    await When('I update the user\'s job to "Architect" via PUT request', null, { api }); 
    await Then('the HTTP response is 200', null, { api }); 
    await And('the response contains the name "Neo" and job "Architect"', null, { api }); 
    await And('the response contains a valid update timestamp', null, { api }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $runScenarioHooks, api, logger }) => $runScenarioHooks('before', { api, logger }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\api\\user-management.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":12,"pickleLine":15,"tags":["@api","@users","@read","@public"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given I am logged in as a valid user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I send an unauthenticated GET request to \"/api/users?page=1\"","stepMatchArguments":[{"group":{"start":41,"value":"\"/api/users?page=1\"","children":[{"start":42,"value":"/api/users?page=1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":15,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the response contains correct pagination metadata for page 1","stepMatchArguments":[{"group":{"start":59,"value":"1","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":18,"pickleLine":16,"tags":["@api","@users","@read","@public"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given I am logged in as a valid user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I send an unauthenticated GET request to \"/api/users?page=2\"","stepMatchArguments":[{"group":{"start":41,"value":"\"/api/users?page=2\"","children":[{"start":42,"value":"/api/users?page=2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":21,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"And the response contains correct pagination metadata for page 2","stepMatchArguments":[{"group":{"start":59,"value":"2","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":26,"pickleLine":20,"tags":["@api","@users","@write","@create","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given I am logged in as a valid user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I create a new user with name \"Morpheus\" and job \"Leader\"","stepMatchArguments":[{"group":{"start":30,"value":"\"Morpheus\"","children":[{"start":31,"value":"Morpheus","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":49,"value":"\"Leader\"","children":[{"start":50,"value":"Leader","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 201","stepMatchArguments":[{"group":{"start":21,"value":"201","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":29,"gherkinStepLine":23,"keywordType":"Outcome","textWithKeyword":"And the response contains the name \"Morpheus\" and job \"Leader\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Morpheus\"","children":[{"start":32,"value":"Morpheus","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"\"Leader\"","children":[{"start":51,"value":"Leader","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"And the response contains a newly generated user ID","stepMatchArguments":[]}]},
  {"pwTestLine":33,"pickleLine":28,"tags":["@api","@users","@write","@delete","@secure"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given I am logged in as a valid user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"When I send an authenticated DELETE request to \"/api/users/2\"","stepMatchArguments":[{"group":{"start":42,"value":"\"/api/users/2\"","children":[{"start":43,"value":"/api/users/2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 204","stepMatchArguments":[{"group":{"start":21,"value":"204","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":36,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"And the response has no content","stepMatchArguments":[]}]},
  {"pwTestLine":39,"pickleLine":35,"tags":["@api","@users","@write","@update","@positive","@secure"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"Given I am logged in as a valid user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":36,"keywordType":"Context","textWithKeyword":"Given a user with name \"Neo\" and job \"The One\" is created","stepMatchArguments":[{"group":{"start":17,"value":"\"Neo\"","children":[{"start":18,"value":"Neo","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":31,"value":"\"The One\"","children":[{"start":32,"value":"The One","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"When I update the user's job to \"Architect\" via PUT request","stepMatchArguments":[{"group":{"start":27,"value":"\"Architect\"","children":[{"start":28,"value":"Architect","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":42,"gherkinStepLine":38,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":43,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"And the response contains the name \"Neo\" and job \"Architect\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Neo\"","children":[{"start":32,"value":"Neo","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":45,"value":"\"Architect\"","children":[{"start":46,"value":"Architect","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":44,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"And the response contains a valid update timestamp","stepMatchArguments":[]}]},
]; // bdd-data-end