// Generated from: src\features\api\users.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('User Management (API)', () => {

  test.beforeEach('Background', async ({ Given, And, apiClient, logger }, testInfo) => { if (testInfo.error) return;
    await Given('the API is available and running', null, { apiClient, logger }); 
    await And('the API client is initialized', null, { apiClient, logger }); 
  });
  
  test.describe('List users for a specific page', () => {

    test('Example #1', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I request the user list for page 1', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 200', null, { logger, testState }); 
      await And('the response contains correct pagination metadata for page 1', null, { logger, testState }); 
      await And('the response contains a list of users', null, { testState }); 
    });

    test('Example #2', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I request the user list for page 2', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 200', null, { logger, testState }); 
      await And('the response contains correct pagination metadata for page 2', null, { logger, testState }); 
      await And('the response contains a list of users', null, { testState }); 
    });

  });

  test('Attempting to list a non-existent user page', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('I request the user list for page 999', null, { apiClient, logger, testState }); 
    await Then('the HTTP response is 200', null, { logger, testState }); 
    await And('the response contains an empty list of users', null, { testState }); 
  });

  test.describe('View the details of an existing user', () => {

    test('Example #1', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I request the user details for ID "1"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 200', null, { logger, testState }); 
      await And('the response contains the user data for ID "1"', null, { logger, testState }); 
    });

    test('Example #2', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I request the user details for ID "2"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 200', null, { logger, testState }); 
      await And('the response contains the user data for ID "2"', null, { logger, testState }); 
    });

    test('Example #3', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I request the user details for ID "5"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 200', null, { logger, testState }); 
      await And('the response contains the user data for ID "5"', null, { logger, testState }); 
    });

  });

  test.describe('Attempting to view a non-existent user', () => {

    test('Example #1', { tag: ['@api', '@users', '@read', '@negative'] }, async ({ When, Then, apiClient, logger, testState }) => { 
      await When('I request the user details for ID "23"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 404', null, { logger, testState }); 
    });

    test('Example #2', { tag: ['@api', '@users', '@read', '@negative'] }, async ({ When, Then, apiClient, logger, testState }) => { 
      await When('I request the user details for ID "999"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 404', null, { logger, testState }); 
    });

    test('Example #3', { tag: ['@api', '@users', '@read', '@negative'] }, async ({ When, Then, apiClient, logger, testState }) => { 
      await When('I request the user details for ID "0"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 404', null, { logger, testState }); 
    });

  });

  test('Create a new user with valid data', { tag: ['@api', '@users', '@write', '@create', '@positive'] }, async ({ Given, When, Then, And, apiClient, logger, testState }) => { 
    await Given('I have prepared data for a new user with name "Morpheus" and job "Leader"', null, { logger, testState }); 
    await When('I send the create user request', null, { apiClient, logger, testState }); 
    await Then('the HTTP response is 201', null, { logger, testState }); 
    await And('the response contains the name "Morpheus" and job "Leader"', null, { testState }); 
    await And('the response contains a newly generated user ID', null, { testState }); 
    await And('the response contains a creation timestamp', null, { testState }); 
  });

  test('Create multiple users (from create_users.feature file)', { tag: ['@api', '@users', '@write', '@create', '@positive', '@bulk'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
    await When('I send a create request for the following users:', {"dataTable":{"rows":[{"cells":[{"value":"name"},{"value":"job"}]},{"cells":[{"value":"Alice QA"},{"value":"Tester"}]},{"cells":[{"value":"Bob Dev"},{"value":"Dev"}]}]}}, { apiClient, logger, testState }); 
    await Then('all create requests are successful', null, { testState }); 
    await And('I can verify that user "Alice QA" was created with job "Tester"', null, { testState }); 
    await And('I can verify that user "Bob Dev" was created with job "Dev"', null, { testState }); 
  });

  test.describe('Creating a user with missing data (provider behavior)', () => {

    test('Example #1', { tag: ['@api', '@users', '@write', '@create', '@negative'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I send the create user request with name "Morpheus" and job ""', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 201', null, { logger, testState }); 
      await And('the response contains a newly generated user ID', null, { testState }); 
      await And('the response contains a creation timestamp', null, { testState }); 
      await And('the response contains the name "Morpheus" and job ""', null, { testState }); 
    });

    test('Example #2', { tag: ['@api', '@users', '@write', '@create', '@negative'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I send the create user request with name "" and job "Leader"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 201', null, { logger, testState }); 
      await And('the response contains a newly generated user ID', null, { testState }); 
      await And('the response contains a creation timestamp', null, { testState }); 
      await And('the response contains the name "" and job "Leader"', null, { testState }); 
    });

    test('Example #3', { tag: ['@api', '@users', '@write', '@create', '@negative'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I send the create user request with name "" and job ""', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 201', null, { logger, testState }); 
      await And('the response contains a newly generated user ID', null, { testState }); 
      await And('the response contains a creation timestamp', null, { testState }); 
      await And('the response contains the name "" and job ""', null, { testState }); 
    });

  });

  test.describe('Fully update an existing user (PUT)', () => {

    test('Example #1', { tag: ['@api', '@users', '@write', '@update', '@positive'] }, async ({ Given, When, Then, And, apiClient, logger, testState }) => { 
      await Given('I want to update user "2" with name "Neo" and job "The One"', null, { logger, testState }); 
      await When('I send a PUT request for user "2"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 200', null, { logger, testState }); 
      await And('the response contains the updated name "Neo" and job "The One"', null, { testState }); 
      await And('the response contains an update timestamp', null, { testState }); 
    });

  });

  test.describe('Partially update an existing user (PATCH)', () => {

    test('Example #1', { tag: ['@api', '@users', '@write', '@update', '@positive'] }, async ({ Given, When, Then, And, apiClient, logger, testState }) => { 
      await Given('I want to update user "3" with only the job "Zion Resident"', null, { logger, testState }); 
      await When('I send a PATCH request for user "3"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 200', null, { logger, testState }); 
      await And('the response contains the updated job "Zion Resident"', null, { testState }); 
      await And('the response contains an update timestamp', null, { testState }); 
    });

  });

  test('Attempting to update a non-existent user (provider behavior)', { tag: ['@api', '@users', '@write', '@update', '@negative'] }, async ({ Given, When, Then, And, apiClient, logger, testState }) => { 
    await Given('I want to update user "999" with only the job "Ghost"', null, { logger, testState }); 
    await When('I send a PATCH request for user "999"', null, { apiClient, logger, testState }); 
    await Then('the HTTP response is 200', null, { logger, testState }); 
    await And('the response contains an update timestamp', null, { testState }); 
  });

  test.describe('Delete an existing user', () => {

    test('Example #1', { tag: ['@api', '@users', '@write', '@delete', '@positive'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I send a delete request for user "2"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 204', null, { logger, testState }); 
      await And('the response has no content', null, { testState }); 
    });

    test('Example #2', { tag: ['@api', '@users', '@write', '@delete', '@positive'] }, async ({ When, Then, And, apiClient, logger, testState }) => { 
      await When('I send a delete request for user "4"', null, { apiClient, logger, testState }); 
      await Then('the HTTP response is 204', null, { logger, testState }); 
      await And('the response has no content', null, { testState }); 
    });

  });

  test('Attempting to delete a non-existent user (provider behavior)', { tag: ['@api', '@users', '@write', '@delete', '@negative'] }, async ({ When, Then, apiClient, logger, testState }) => { 
    await When('I send a delete request for user "999"', null, { apiClient, logger, testState }); 
    await Then('the HTTP response is 204', null, { logger, testState }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $runScenarioHooks, logger, testInfo }) => $runScenarioHooks('before', { logger, testInfo }));
test.afterEach('AfterEach Hooks', ({ $runScenarioHooks, logger, page, testInfo }) => $runScenarioHooks('after', { logger, page, testInfo }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\api\\users.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":13,"pickleLine":19,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I request the user list for page 1","stepMatchArguments":[{"group":{"start":33,"value":"1","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":15,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":16,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the response contains correct pagination metadata for page 1","stepMatchArguments":[{"group":{"start":59,"value":"1","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":17,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the response contains a list of users","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":20,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I request the user list for page 2","stepMatchArguments":[{"group":{"start":33,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":22,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":23,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"And the response contains correct pagination metadata for page 2","stepMatchArguments":[{"group":{"start":59,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":24,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"And the response contains a list of users","stepMatchArguments":[]}]},
  {"pwTestLine":29,"pickleLine":23,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I request the user list for page 999","stepMatchArguments":[{"group":{"start":33,"value":"999","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":31,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":32,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"And the response contains an empty list of users","stepMatchArguments":[]}]},
  {"pwTestLine":37,"pickleLine":35,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I request the user details for ID \"1\"","stepMatchArguments":[{"group":{"start":34,"value":"\"1\"","children":[{"start":35,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":40,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"And the response contains the user data for ID \"1\"","stepMatchArguments":[{"group":{"start":43,"value":"\"1\"","children":[{"start":44,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":43,"pickleLine":36,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I request the user details for ID \"2\"","stepMatchArguments":[{"group":{"start":34,"value":"\"2\"","children":[{"start":35,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":45,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":46,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"And the response contains the user data for ID \"2\"","stepMatchArguments":[{"group":{"start":43,"value":"\"2\"","children":[{"start":44,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":49,"pickleLine":37,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I request the user details for ID \"5\"","stepMatchArguments":[{"group":{"start":34,"value":"\"5\"","children":[{"start":35,"value":"5","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":51,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":52,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"And the response contains the user data for ID \"5\"","stepMatchArguments":[{"group":{"start":43,"value":"\"5\"","children":[{"start":44,"value":"5","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":59,"pickleLine":45,"tags":["@api","@users","@read","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":60,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When I request the user details for ID \"23\"","stepMatchArguments":[{"group":{"start":34,"value":"\"23\"","children":[{"start":35,"value":"23","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":61,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 404","stepMatchArguments":[{"group":{"start":21,"value":"404","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":64,"pickleLine":46,"tags":["@api","@users","@read","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When I request the user details for ID \"999\"","stepMatchArguments":[{"group":{"start":34,"value":"\"999\"","children":[{"start":35,"value":"999","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":66,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 404","stepMatchArguments":[{"group":{"start":21,"value":"404","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":69,"pickleLine":47,"tags":["@api","@users","@read","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When I request the user details for ID \"0\"","stepMatchArguments":[{"group":{"start":34,"value":"\"0\"","children":[{"start":35,"value":"0","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":71,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 404","stepMatchArguments":[{"group":{"start":21,"value":"404","children":[]},"parameterTypeName":"int"}]}]},
  {"pwTestLine":76,"pickleLine":51,"tags":["@api","@users","@write","@create","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":77,"gherkinStepLine":52,"keywordType":"Context","textWithKeyword":"Given I have prepared data for a new user with name \"Morpheus\" and job \"Leader\"","stepMatchArguments":[{"group":{"start":46,"value":"\"Morpheus\"","children":[{"start":47,"value":"Morpheus","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":65,"value":"\"Leader\"","children":[{"start":66,"value":"Leader","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":78,"gherkinStepLine":53,"keywordType":"Action","textWithKeyword":"When I send the create user request","stepMatchArguments":[]},{"pwStepLine":79,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 201","stepMatchArguments":[{"group":{"start":21,"value":"201","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":80,"gherkinStepLine":55,"keywordType":"Outcome","textWithKeyword":"And the response contains the name \"Morpheus\" and job \"Leader\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Morpheus\"","children":[{"start":32,"value":"Morpheus","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"\"Leader\"","children":[{"start":51,"value":"Leader","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":81,"gherkinStepLine":56,"keywordType":"Outcome","textWithKeyword":"And the response contains a newly generated user ID","stepMatchArguments":[]},{"pwStepLine":82,"gherkinStepLine":57,"keywordType":"Outcome","textWithKeyword":"And the response contains a creation timestamp","stepMatchArguments":[]}]},
  {"pwTestLine":85,"pickleLine":60,"tags":["@api","@users","@write","@create","@positive","@bulk"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":86,"gherkinStepLine":61,"keywordType":"Action","textWithKeyword":"When I send a create request for the following users:","stepMatchArguments":[]},{"pwStepLine":87,"gherkinStepLine":65,"keywordType":"Outcome","textWithKeyword":"Then all create requests are successful","stepMatchArguments":[]},{"pwStepLine":88,"gherkinStepLine":66,"keywordType":"Outcome","textWithKeyword":"And I can verify that user \"Alice QA\" was created with job \"Tester\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Alice QA\"","children":[{"start":24,"value":"Alice QA","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Tester\"","children":[{"start":56,"value":"Tester","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":89,"gherkinStepLine":67,"keywordType":"Outcome","textWithKeyword":"And I can verify that user \"Bob Dev\" was created with job \"Dev\"","stepMatchArguments":[{"group":{"start":23,"value":"\"Bob Dev\"","children":[{"start":24,"value":"Bob Dev","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":54,"value":"\"Dev\"","children":[{"start":55,"value":"Dev","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":94,"pickleLine":79,"tags":["@api","@users","@write","@create","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":95,"gherkinStepLine":72,"keywordType":"Action","textWithKeyword":"When I send the create user request with name \"Morpheus\" and job \"\"","stepMatchArguments":[{"group":{"start":41,"value":"\"Morpheus\"","children":[{"start":42,"value":"Morpheus","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":60,"value":"\"\"","children":[{"start":61,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":96,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 201","stepMatchArguments":[{"group":{"start":21,"value":"201","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":97,"gherkinStepLine":74,"keywordType":"Outcome","textWithKeyword":"And the response contains a newly generated user ID","stepMatchArguments":[]},{"pwStepLine":98,"gherkinStepLine":75,"keywordType":"Outcome","textWithKeyword":"And the response contains a creation timestamp","stepMatchArguments":[]},{"pwStepLine":99,"gherkinStepLine":76,"keywordType":"Outcome","textWithKeyword":"And the response contains the name \"Morpheus\" and job \"\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Morpheus\"","children":[{"start":32,"value":"Morpheus","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"\"\"","children":[{"start":51,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":102,"pickleLine":80,"tags":["@api","@users","@write","@create","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":103,"gherkinStepLine":72,"keywordType":"Action","textWithKeyword":"When I send the create user request with name \"\" and job \"Leader\"","stepMatchArguments":[{"group":{"start":41,"value":"\"\"","children":[{"start":42,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":52,"value":"\"Leader\"","children":[{"start":53,"value":"Leader","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":104,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 201","stepMatchArguments":[{"group":{"start":21,"value":"201","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":105,"gherkinStepLine":74,"keywordType":"Outcome","textWithKeyword":"And the response contains a newly generated user ID","stepMatchArguments":[]},{"pwStepLine":106,"gherkinStepLine":75,"keywordType":"Outcome","textWithKeyword":"And the response contains a creation timestamp","stepMatchArguments":[]},{"pwStepLine":107,"gherkinStepLine":76,"keywordType":"Outcome","textWithKeyword":"And the response contains the name \"\" and job \"Leader\"","stepMatchArguments":[{"group":{"start":31,"value":"\"\"","children":[{"start":32,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":42,"value":"\"Leader\"","children":[{"start":43,"value":"Leader","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":110,"pickleLine":81,"tags":["@api","@users","@write","@create","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":111,"gherkinStepLine":72,"keywordType":"Action","textWithKeyword":"When I send the create user request with name \"\" and job \"\"","stepMatchArguments":[{"group":{"start":41,"value":"\"\"","children":[{"start":42,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":52,"value":"\"\"","children":[{"start":53,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":112,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 201","stepMatchArguments":[{"group":{"start":21,"value":"201","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":113,"gherkinStepLine":74,"keywordType":"Outcome","textWithKeyword":"And the response contains a newly generated user ID","stepMatchArguments":[]},{"pwStepLine":114,"gherkinStepLine":75,"keywordType":"Outcome","textWithKeyword":"And the response contains a creation timestamp","stepMatchArguments":[]},{"pwStepLine":115,"gherkinStepLine":76,"keywordType":"Outcome","textWithKeyword":"And the response contains the name \"\" and job \"\"","stepMatchArguments":[{"group":{"start":31,"value":"\"\"","children":[{"start":32,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":42,"value":"\"\"","children":[{"start":43,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":122,"pickleLine":94,"tags":["@api","@users","@write","@update","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":123,"gherkinStepLine":87,"keywordType":"Context","textWithKeyword":"Given I want to update user \"2\" with name \"Neo\" and job \"The One\"","stepMatchArguments":[{"group":{"start":22,"value":"\"2\"","children":[{"start":23,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":36,"value":"\"Neo\"","children":[{"start":37,"value":"Neo","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":50,"value":"\"The One\"","children":[{"start":51,"value":"The One","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":124,"gherkinStepLine":88,"keywordType":"Action","textWithKeyword":"When I send a PUT request for user \"2\"","stepMatchArguments":[{"group":{"start":30,"value":"\"2\"","children":[{"start":31,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":125,"gherkinStepLine":89,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":126,"gherkinStepLine":90,"keywordType":"Outcome","textWithKeyword":"And the response contains the updated name \"Neo\" and job \"The One\"","stepMatchArguments":[{"group":{"start":39,"value":"\"Neo\"","children":[{"start":40,"value":"Neo","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":53,"value":"\"The One\"","children":[{"start":54,"value":"The One","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":127,"gherkinStepLine":91,"keywordType":"Outcome","textWithKeyword":"And the response contains an update timestamp","stepMatchArguments":[]}]},
  {"pwTestLine":134,"pickleLine":105,"tags":["@api","@users","@write","@update","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":135,"gherkinStepLine":98,"keywordType":"Context","textWithKeyword":"Given I want to update user \"3\" with only the job \"Zion Resident\"","stepMatchArguments":[{"group":{"start":22,"value":"\"3\"","children":[{"start":23,"value":"3","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":44,"value":"\"Zion Resident\"","children":[{"start":45,"value":"Zion Resident","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":136,"gherkinStepLine":99,"keywordType":"Action","textWithKeyword":"When I send a PATCH request for user \"3\"","stepMatchArguments":[{"group":{"start":32,"value":"\"3\"","children":[{"start":33,"value":"3","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":137,"gherkinStepLine":100,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":138,"gherkinStepLine":101,"keywordType":"Outcome","textWithKeyword":"And the response contains the updated job \"Zion Resident\"","stepMatchArguments":[{"group":{"start":38,"value":"\"Zion Resident\"","children":[{"start":39,"value":"Zion Resident","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":139,"gherkinStepLine":102,"keywordType":"Outcome","textWithKeyword":"And the response contains an update timestamp","stepMatchArguments":[]}]},
  {"pwTestLine":144,"pickleLine":108,"tags":["@api","@users","@write","@update","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":145,"gherkinStepLine":109,"keywordType":"Context","textWithKeyword":"Given I want to update user \"999\" with only the job \"Ghost\"","stepMatchArguments":[{"group":{"start":22,"value":"\"999\"","children":[{"start":23,"value":"999","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":46,"value":"\"Ghost\"","children":[{"start":47,"value":"Ghost","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":146,"gherkinStepLine":110,"keywordType":"Action","textWithKeyword":"When I send a PATCH request for user \"999\"","stepMatchArguments":[{"group":{"start":32,"value":"\"999\"","children":[{"start":33,"value":"999","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":147,"gherkinStepLine":111,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":148,"gherkinStepLine":112,"keywordType":"Outcome","textWithKeyword":"And the response contains an update timestamp","stepMatchArguments":[]}]},
  {"pwTestLine":153,"pickleLine":122,"tags":["@api","@users","@write","@delete","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":154,"gherkinStepLine":117,"keywordType":"Action","textWithKeyword":"When I send a delete request for user \"2\"","stepMatchArguments":[{"group":{"start":33,"value":"\"2\"","children":[{"start":34,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":155,"gherkinStepLine":118,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 204","stepMatchArguments":[{"group":{"start":21,"value":"204","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":156,"gherkinStepLine":119,"keywordType":"Outcome","textWithKeyword":"And the response has no content","stepMatchArguments":[]}]},
  {"pwTestLine":159,"pickleLine":123,"tags":["@api","@users","@write","@delete","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":160,"gherkinStepLine":117,"keywordType":"Action","textWithKeyword":"When I send a delete request for user \"4\"","stepMatchArguments":[{"group":{"start":33,"value":"\"4\"","children":[{"start":34,"value":"4","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":161,"gherkinStepLine":118,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 204","stepMatchArguments":[{"group":{"start":21,"value":"204","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":162,"gherkinStepLine":119,"keywordType":"Outcome","textWithKeyword":"And the response has no content","stepMatchArguments":[]}]},
  {"pwTestLine":167,"pickleLine":126,"tags":["@api","@users","@write","@delete","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given the API is available and running","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And the API client is initialized","isBg":true,"stepMatchArguments":[]},{"pwStepLine":168,"gherkinStepLine":127,"keywordType":"Action","textWithKeyword":"When I send a delete request for user \"999\"","stepMatchArguments":[{"group":{"start":33,"value":"\"999\"","children":[{"start":34,"value":"999","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":169,"gherkinStepLine":128,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 204","stepMatchArguments":[{"group":{"start":21,"value":"204","children":[]},"parameterTypeName":"int"}]}]},
]; // bdd-data-end