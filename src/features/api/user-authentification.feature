@api @auth
Feature: User Authentication

  Background:
    # Pașii de verificare a setup-ului sunt acum gestionați de fixturi
    Given no previous auth token is set

  # --- REGISTER ---
  @register @positive
  Scenario: Register a new user with valid credentials
    When I send a POST request to "/api/register" with email "eve.holt@reqres.in" and password "pistol"
    Then the HTTP response is 200
    And the response contains a newly generated user ID as a number
    And the response contains a valid auth token
    # Token-ul este salvat aici în HeadersManager

  @register @negative
  Scenario Outline: Registration fails when data is invalid or missing
    When I send a POST request to "/api/register" with email "<email>" and password "<password>"
    Then the HTTP response is 400
    And the response contains the error message "<expectedError>"
    Examples:
      | email              | password | expectedError        |
      | sydney@fife        |          | Missing password     |
      |                    | pass     | Missing email or username        |
      | invalid-email      | pass     | Note: Only defined users succeed registration |

  # --- LOGIN ---
  @login @positive
  Scenario: Login succeeds with valid credentials
    When I send a POST request to "/api/login" with email "eve.holt@reqres.in" and password "cityslicka"
    Then the HTTP response is 200
    And the response contains a valid auth token
    # Token-ul este salvat aici în HeadersManager

  @login @negative
  Scenario Outline: Login fails with invalid or missing credentials
    When I send a POST request to "/api/login" with email "<email>" and password "<password>"
    Then the HTTP response is 400
    And the response contains the error message "<expectedError>"
    Examples:
      | email                  | password | expectedError    |
      |                        | pass     | Missing email or username   |
      | peter.klaven@reqres.in |          | Missing password |
      | bad@email.com          | secret   | user not found   |