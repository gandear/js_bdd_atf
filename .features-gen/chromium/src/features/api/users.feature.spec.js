// Generated from: src\features\api\users.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('Users API', () => {

  test.describe('List users for page <page>', () => {

    test('List users for page 1', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch users page 1', null, { apiClient, apiState, log }); 
      await Then('a users list is returned', null, { apiState, log }); 
    });

    test('List users for page 2', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch users page 2', null, { apiClient, apiState, log }); 
      await Then('a users list is returned', null, { apiState, log }); 
    });

  });

  test.describe('Get existing user by id <id>', () => {

    test('Get existing user by id 1', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "1"', null, { apiClient, apiState, log }); 
      await Then('a single user is returned', null, { apiState, log }); 
    });

    test('Get existing user by id 2', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "2"', null, { apiClient, apiState, log }); 
      await Then('a single user is returned', null, { apiState, log }); 
    });

    test('Get existing user by id 3', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "3"', null, { apiClient, apiState, log }); 
      await Then('a single user is returned', null, { apiState, log }); 
    });

    test('Get existing user by id 4', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "4"', null, { apiClient, apiState, log }); 
      await Then('a single user is returned', null, { apiState, log }); 
    });

    test('Get existing user by id 5', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "5"', null, { apiClient, apiState, log }); 
      await Then('a single user is returned', null, { apiState, log }); 
    });

    test('Get existing user by id 6', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "6"', null, { apiClient, apiState, log }); 
      await Then('a single user is returned', null, { apiState, log }); 
    });

  });

  test.describe('Get non-existing user by id <id>', () => {

    test('Get non-existing user by id 23', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "23"', null, { apiClient, apiState, log }); 
      await Then('the user is not found', null, { apiState, log }); 
    });

    test('Get non-existing user by id 999', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "999"', null, { apiClient, apiState, log }); 
      await Then('the user is not found', null, { apiState, log }); 
    });

    test('Get non-existing user by id 0', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "0"', null, { apiClient, apiState, log }); 
      await Then('the user is not found', null, { apiState, log }); 
    });

    test('Get non-existing user by id -1', { tag: ['@api', '@users', '@read'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I fetch user with id "-1"', null, { apiClient, apiState, log }); 
      await Then('the user is not found', null, { apiState, log }); 
    });

  });

  test('Create a random user', { tag: ['@api', '@users', '@write'] }, async ({ When, Then, apiState, log, testDataManager }) => { 
    await When('I create a random user', null, { apiState, log, testDataManager }); 
    await Then('the user is created', null, { apiState, log }); 
  });

  test.describe('Update user <id> with a new job', () => {

    test('Update user 1 with a new job', { tag: ['@api', '@users', '@write'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I update user "1" with a new job', null, { apiClient, apiState, log }); 
      await Then('the user is updated', null, { apiState, log }); 
    });

    test('Update user 2 with a new job', { tag: ['@api', '@users', '@write'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I update user "2" with a new job', null, { apiClient, apiState, log }); 
      await Then('the user is updated', null, { apiState, log }); 
    });

    test('Update user 3 with a new job', { tag: ['@api', '@users', '@write'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I update user "3" with a new job', null, { apiClient, apiState, log }); 
      await Then('the user is updated', null, { apiState, log }); 
    });

  });

  test.describe('Delete user <id>', () => {

    test('Delete user 1', { tag: ['@api', '@users', '@write'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I delete user "1"', null, { apiClient, apiState, log }); 
      await Then('the user is deleted', null, { apiState, log }); 
    });

    test('Delete user 2', { tag: ['@api', '@users', '@write'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I delete user "2"', null, { apiClient, apiState, log }); 
      await Then('the user is deleted', null, { apiState, log }); 
    });

    test('Delete user 3', { tag: ['@api', '@users', '@write'] }, async ({ When, Then, apiClient, apiState, log }) => { 
      await When('I delete user "3"', null, { apiClient, apiState, log }); 
      await Then('the user is deleted', null, { apiState, log }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\api\\users.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":12,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":9,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I fetch users page 1","stepMatchArguments":[{"group":{"start":19,"value":"1","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":10,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then a users list is returned","stepMatchArguments":[]}]},
  {"pwTestLine":13,"pickleLine":13,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":14,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I fetch users page 2","stepMatchArguments":[{"group":{"start":19,"value":"2","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":15,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then a users list is returned","stepMatchArguments":[]}]},
  {"pwTestLine":22,"pickleLine":21,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":23,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"1\"","stepMatchArguments":[{"group":{"start":21,"value":"\"1\"","children":[{"start":22,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then a single user is returned","stepMatchArguments":[]}]},
  {"pwTestLine":27,"pickleLine":22,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":28,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"2\"","stepMatchArguments":[{"group":{"start":21,"value":"\"2\"","children":[{"start":22,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then a single user is returned","stepMatchArguments":[]}]},
  {"pwTestLine":32,"pickleLine":23,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":33,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"3\"","stepMatchArguments":[{"group":{"start":21,"value":"\"3\"","children":[{"start":22,"value":"3","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then a single user is returned","stepMatchArguments":[]}]},
  {"pwTestLine":37,"pickleLine":24,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":38,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"4\"","stepMatchArguments":[{"group":{"start":21,"value":"\"4\"","children":[{"start":22,"value":"4","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then a single user is returned","stepMatchArguments":[]}]},
  {"pwTestLine":42,"pickleLine":25,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":43,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"5\"","stepMatchArguments":[{"group":{"start":21,"value":"\"5\"","children":[{"start":22,"value":"5","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":44,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then a single user is returned","stepMatchArguments":[]}]},
  {"pwTestLine":47,"pickleLine":26,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":48,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"6\"","stepMatchArguments":[{"group":{"start":21,"value":"\"6\"","children":[{"start":22,"value":"6","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":49,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then a single user is returned","stepMatchArguments":[]}]},
  {"pwTestLine":56,"pickleLine":34,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":57,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"23\"","stepMatchArguments":[{"group":{"start":21,"value":"\"23\"","children":[{"start":22,"value":"23","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":58,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the user is not found","stepMatchArguments":[]}]},
  {"pwTestLine":61,"pickleLine":35,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":62,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"999\"","stepMatchArguments":[{"group":{"start":21,"value":"\"999\"","children":[{"start":22,"value":"999","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":63,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the user is not found","stepMatchArguments":[]}]},
  {"pwTestLine":66,"pickleLine":36,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":67,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"0\"","stepMatchArguments":[{"group":{"start":21,"value":"\"0\"","children":[{"start":22,"value":"0","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":68,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the user is not found","stepMatchArguments":[]}]},
  {"pwTestLine":71,"pickleLine":37,"tags":["@api","@users","@read"],"steps":[{"pwStepLine":72,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I fetch user with id \"-1\"","stepMatchArguments":[{"group":{"start":21,"value":"\"-1\"","children":[{"start":22,"value":"-1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":73,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the user is not found","stepMatchArguments":[]}]},
  {"pwTestLine":78,"pickleLine":41,"tags":["@api","@users","@write"],"steps":[{"pwStepLine":79,"gherkinStepLine":42,"keywordType":"Action","textWithKeyword":"When I create a random user","stepMatchArguments":[]},{"pwStepLine":80,"gherkinStepLine":43,"keywordType":"Outcome","textWithKeyword":"Then the user is created","stepMatchArguments":[]}]},
  {"pwTestLine":85,"pickleLine":51,"tags":["@api","@users","@write"],"steps":[{"pwStepLine":86,"gherkinStepLine":47,"keywordType":"Action","textWithKeyword":"When I update user \"1\" with a new job","stepMatchArguments":[{"group":{"start":14,"value":"\"1\"","children":[{"start":15,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":87,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Then the user is updated","stepMatchArguments":[]}]},
  {"pwTestLine":90,"pickleLine":52,"tags":["@api","@users","@write"],"steps":[{"pwStepLine":91,"gherkinStepLine":47,"keywordType":"Action","textWithKeyword":"When I update user \"2\" with a new job","stepMatchArguments":[{"group":{"start":14,"value":"\"2\"","children":[{"start":15,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":92,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Then the user is updated","stepMatchArguments":[]}]},
  {"pwTestLine":95,"pickleLine":53,"tags":["@api","@users","@write"],"steps":[{"pwStepLine":96,"gherkinStepLine":47,"keywordType":"Action","textWithKeyword":"When I update user \"3\" with a new job","stepMatchArguments":[{"group":{"start":14,"value":"\"3\"","children":[{"start":15,"value":"3","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":97,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Then the user is updated","stepMatchArguments":[]}]},
  {"pwTestLine":104,"pickleLine":61,"tags":["@api","@users","@write"],"steps":[{"pwStepLine":105,"gherkinStepLine":57,"keywordType":"Action","textWithKeyword":"When I delete user \"1\"","stepMatchArguments":[{"group":{"start":14,"value":"\"1\"","children":[{"start":15,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":106,"gherkinStepLine":58,"keywordType":"Outcome","textWithKeyword":"Then the user is deleted","stepMatchArguments":[]}]},
  {"pwTestLine":109,"pickleLine":62,"tags":["@api","@users","@write"],"steps":[{"pwStepLine":110,"gherkinStepLine":57,"keywordType":"Action","textWithKeyword":"When I delete user \"2\"","stepMatchArguments":[{"group":{"start":14,"value":"\"2\"","children":[{"start":15,"value":"2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":111,"gherkinStepLine":58,"keywordType":"Outcome","textWithKeyword":"Then the user is deleted","stepMatchArguments":[]}]},
  {"pwTestLine":114,"pickleLine":63,"tags":["@api","@users","@write"],"steps":[{"pwStepLine":115,"gherkinStepLine":57,"keywordType":"Action","textWithKeyword":"When I delete user \"3\"","stepMatchArguments":[{"group":{"start":14,"value":"\"3\"","children":[{"start":15,"value":"3","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":116,"gherkinStepLine":58,"keywordType":"Outcome","textWithKeyword":"Then the user is deleted","stepMatchArguments":[]}]},
]; // bdd-data-end