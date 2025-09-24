@api @auth
Feature: Auth API

  # --- REGISTER ---
  @positive @register
  Scenario Outline: Register with valid creds
    When I register with email "<email>" and password "<password>"
    Then registration succeeds
  Examples:
    | email              | password |
    | eve.holt@reqres.in | pistol   |

  @negative @register
  Scenario Outline: Register with invalid creds
    When I register with email "<email>" and password "<password>"
    Then registration fails with an error
  Examples:
    | email         | password |
    | sydney@fife   |          |
    | invalid-email | pass     |
    |               | pass     |

  # --- LOGIN ---
  @positive @login
  Scenario Outline: Login with valid creds
    When I login with email "<email>" and password "<password>"
    Then login succeeds
  Examples:
    | email              | password   |
    | eve.holt@reqres.in | cityslicka |

  @negative @login
  Scenario Outline: Login with invalid creds
    When I login with email "<email>" and password "<password>"
    Then login fails with an error
  Examples:
    | email         | password |
    |               | pass     |
    | user@test.com |          |
    | bad@          | secret   |

  # --- SESSION TOKEN (helper) ---
  @session
  Scenario: Authenticate and keep token in client
    When I authenticate with valid credentials
    Then the client holds a bearer token
