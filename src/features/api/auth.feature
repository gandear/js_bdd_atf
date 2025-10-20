@api @auth
Feature: User Authentication

  Background:
    Given the authentication endpoint is configured
    And the API client is ready
    And no previous auth token is set

  # --- REGISTER ---
  @positive @register
  Scenario: Register a new user with valid credentials
    When I register a user with email "eve.holt@reqres.in" and password "pistol"
    Then the HTTP response is 200
    And the response contains a user ID
    And the response contains an authentication token

  @negative @register
  Scenario Outline: Registration fails when data is invalid or missing
    When I register a user with email "<email>" and password "<password>"
    Then the HTTP response is 400
    And the response contains the error message "<expectedError>"
    Examples:
      | email         | password | expectedError                              |
      | sydney@fife   |          | Missing password                           |
      |               | pass     | Missing email                              |
      | invalid-email | pass     | Note: Only defined users succeed registration |

  # --- LOGIN ---
  @positive @login
  Scenario Outline: Login succeeds with valid credentials
    When I log in with email "<email>" and password "<password>"
    Then the HTTP response is 200
    And the response contains an authentication token
    Examples:
      | email              | password   |
      | eve.holt@reqres.in | cityslicka |

  @negative @login
  Scenario Outline: Login fails with invalid or missing credentials
    When I log in with email "<email>" and password "<password>"
    Then the HTTP response is 400
    And the response contains the error message "<expectedError>"
    Examples:
      | email                  | password | expectedError    |
      |                        | pass     | Missing email    |
      | peter.klaven@reqres.in |          | Missing password |
      | bad@email.com          | secret   | user not found   |
