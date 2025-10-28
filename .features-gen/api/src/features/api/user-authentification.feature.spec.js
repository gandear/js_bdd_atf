// Generated from: src\features\api\user-authentification.feature
import { test } from "../../../../../src/fixtures/index.js";

test.describe('User Authentication', () => {

  test.beforeEach('Background', async ({ Given, api }, testInfo) => { if (testInfo.error) return;
    await Given('no previous auth token is set', null, { api }); 
  });
  
  test('Register a new user with valid credentials', { tag: ['@api', '@auth', '@register', '@positive'] }, async ({ When, Then, And, api }) => { 
    await When('I send a POST request to "/api/register" with email "eve.holt@reqres.in" and password "pistol"', null, { api }); 
    await Then('the HTTP response is 200', null, { api }); 
    await And('the response contains a newly generated user ID as a number', null, { api }); 
    await And('the response contains a valid auth token', null, { api }); 
  });

  test.describe('Registration fails when data is invalid or missing', () => {

    test('Example #1', { tag: ['@api', '@auth', '@register', '@negative'] }, async ({ When, Then, And, api }) => { 
      await When('I send a POST request to "/api/register" with email "sydney@fife" and password ""', null, { api }); 
      await Then('the HTTP response is 400', null, { api }); 
      await And('the response contains the error message "Missing password"', null, { api }); 
    });

    test('Example #2', { tag: ['@api', '@auth', '@register', '@negative'] }, async ({ When, Then, And, api }) => { 
      await When('I send a POST request to "/api/register" with email "" and password "pass"', null, { api }); 
      await Then('the HTTP response is 400', null, { api }); 
      await And('the response contains the error message "Missing email or username"', null, { api }); 
    });

    test('Example #3', { tag: ['@api', '@auth', '@register', '@negative'] }, async ({ When, Then, And, api }) => { 
      await When('I send a POST request to "/api/register" with email "invalid-email" and password "pass"', null, { api }); 
      await Then('the HTTP response is 400', null, { api }); 
      await And('the response contains the error message "Note: Only defined users succeed registration"', null, { api }); 
    });

  });

  test('Login succeeds with valid credentials', { tag: ['@api', '@auth', '@login', '@positive'] }, async ({ When, Then, And, api }) => { 
    await When('I send a POST request to "/api/login" with email "eve.holt@reqres.in" and password "cityslicka"', null, { api }); 
    await Then('the HTTP response is 200', null, { api }); 
    await And('the response contains a valid auth token', null, { api }); 
  });

  test.describe('Login fails with invalid or missing credentials', () => {

    test('Example #1', { tag: ['@api', '@auth', '@login', '@negative'] }, async ({ When, Then, And, api }) => { 
      await When('I send a POST request to "/api/login" with email "" and password "pass"', null, { api }); 
      await Then('the HTTP response is 400', null, { api }); 
      await And('the response contains the error message "Missing email or username"', null, { api }); 
    });

    test('Example #2', { tag: ['@api', '@auth', '@login', '@negative'] }, async ({ When, Then, And, api }) => { 
      await When('I send a POST request to "/api/login" with email "peter.klaven@reqres.in" and password ""', null, { api }); 
      await Then('the HTTP response is 400', null, { api }); 
      await And('the response contains the error message "Missing password"', null, { api }); 
    });

    test('Example #3', { tag: ['@api', '@auth', '@login', '@negative'] }, async ({ When, Then, And, api }) => { 
      await When('I send a POST request to "/api/login" with email "bad@email.com" and password "secret"', null, { api }); 
      await Then('the HTTP response is 400', null, { api }); 
      await And('the response contains the error message "user not found"', null, { api }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('src\\features\\api\\user-authentification.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":10,"tags":["@api","@auth","@register","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/register\" with email \"eve.holt@reqres.in\" and password \"pistol\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/register\"","children":[{"start":26,"value":"/api/register","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":52,"value":"\"eve.holt@reqres.in\"","children":[{"start":53,"value":"eve.holt@reqres.in","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":86,"value":"\"pistol\"","children":[{"start":87,"value":"pistol","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"And the response contains a newly generated user ID as a number","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And the response contains a valid auth token","stepMatchArguments":[]}]},
  {"pwTestLine":19,"pickleLine":24,"tags":["@api","@auth","@register","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/register\" with email \"sydney@fife\" and password \"\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/register\"","children":[{"start":26,"value":"/api/register","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":52,"value":"\"sydney@fife\"","children":[{"start":53,"value":"sydney@fife","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":79,"value":"\"\"","children":[{"start":80,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 400","stepMatchArguments":[{"group":{"start":21,"value":"400","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":22,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And the response contains the error message \"Missing password\"","stepMatchArguments":[{"group":{"start":40,"value":"\"Missing password\"","children":[{"start":41,"value":"Missing password","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":25,"pickleLine":25,"tags":["@api","@auth","@register","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/register\" with email \"\" and password \"pass\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/register\"","children":[{"start":26,"value":"/api/register","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":52,"value":"\"\"","children":[{"start":53,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":68,"value":"\"pass\"","children":[{"start":69,"value":"pass","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 400","stepMatchArguments":[{"group":{"start":21,"value":"400","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":28,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And the response contains the error message \"Missing email or username\"","stepMatchArguments":[{"group":{"start":40,"value":"\"Missing email or username\"","children":[{"start":41,"value":"Missing email or username","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":31,"pickleLine":26,"tags":["@api","@auth","@register","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/register\" with email \"invalid-email\" and password \"pass\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/register\"","children":[{"start":26,"value":"/api/register","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":52,"value":"\"invalid-email\"","children":[{"start":53,"value":"invalid-email","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":81,"value":"\"pass\"","children":[{"start":82,"value":"pass","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":33,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 400","stepMatchArguments":[{"group":{"start":21,"value":"400","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":34,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And the response contains the error message \"Note: Only defined users succeed registration\"","stepMatchArguments":[{"group":{"start":40,"value":"\"Note: Only defined users succeed registration\"","children":[{"start":41,"value":"Note: Only defined users succeed registration","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":39,"pickleLine":30,"tags":["@api","@auth","@login","@positive"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":31,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/login\" with email \"eve.holt@reqres.in\" and password \"cityslicka\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/login\"","children":[{"start":26,"value":"/api/login","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":49,"value":"\"eve.holt@reqres.in\"","children":[{"start":50,"value":"eve.holt@reqres.in","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":83,"value":"\"cityslicka\"","children":[{"start":84,"value":"cityslicka","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 200","stepMatchArguments":[{"group":{"start":21,"value":"200","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":42,"gherkinStepLine":33,"keywordType":"Outcome","textWithKeyword":"And the response contains a valid auth token","stepMatchArguments":[]}]},
  {"pwTestLine":47,"pickleLine":43,"tags":["@api","@auth","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/login\" with email \"\" and password \"pass\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/login\"","children":[{"start":26,"value":"/api/login","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":49,"value":"\"\"","children":[{"start":50,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":65,"value":"\"pass\"","children":[{"start":66,"value":"pass","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":49,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 400","stepMatchArguments":[{"group":{"start":21,"value":"400","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":50,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"And the response contains the error message \"Missing email or username\"","stepMatchArguments":[{"group":{"start":40,"value":"\"Missing email or username\"","children":[{"start":41,"value":"Missing email or username","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":53,"pickleLine":44,"tags":["@api","@auth","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/login\" with email \"peter.klaven@reqres.in\" and password \"\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/login\"","children":[{"start":26,"value":"/api/login","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":49,"value":"\"peter.klaven@reqres.in\"","children":[{"start":50,"value":"peter.klaven@reqres.in","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":87,"value":"\"\"","children":[{"start":88,"value":"","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":55,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 400","stepMatchArguments":[{"group":{"start":21,"value":"400","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":56,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"And the response contains the error message \"Missing password\"","stepMatchArguments":[{"group":{"start":40,"value":"\"Missing password\"","children":[{"start":41,"value":"Missing password","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":59,"pickleLine":45,"tags":["@api","@auth","@login","@negative"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given no previous auth token is set","isBg":true,"stepMatchArguments":[]},{"pwStepLine":60,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I send a POST request to \"/api/login\" with email \"bad@email.com\" and password \"secret\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/api/login\"","children":[{"start":26,"value":"/api/login","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":49,"value":"\"bad@email.com\"","children":[{"start":50,"value":"bad@email.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":78,"value":"\"secret\"","children":[{"start":79,"value":"secret","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":61,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Then the HTTP response is 400","stepMatchArguments":[{"group":{"start":21,"value":"400","children":[]},"parameterTypeName":"int"}]},{"pwStepLine":62,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"And the response contains the error message \"user not found\"","stepMatchArguments":[{"group":{"start":40,"value":"\"user not found\"","children":[{"start":41,"value":"user not found","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end