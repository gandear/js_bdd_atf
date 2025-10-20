@api @users
Feature: User Management (API)
  This feature covers the CRUD (Create, Read, Update, Delete)
  operations for the /users resource.

  Background:
    Given the API is available and running
    And the API client is initialized

  # ---- READ ----
  @read
  Scenario Outline: List users for a specific page
    When I request the user list for page <page>
    Then the HTTP response is 200
    And the response contains correct pagination metadata for page <page>
    And the response contains a list of users
    Examples:
      | page |
      | 1    |
      | 2    |

  @read
  Scenario: Attempting to list a non-existent user page
    When I request the user list for page 999
    Then the HTTP response is 200
    And the response contains an empty list of users

  @read
  Scenario Outline: View the details of an existing user
    When I request the user details for ID "<id>"
    Then the HTTP response is 200
    And the response contains the user data for ID "<id>"
    Examples:
      | id |
      | 1  |
      | 2  |
      | 5  |

  @read @negative
  Scenario Outline: Attempting to view a non-existent user
    When I request the user details for ID "<id>"
    Then the HTTP response is 404
    Examples:
      | id  |
      | 23  |
      | 999 |
      | 0   |

  # ---- CREATE ----
  @write @create @positive
  Scenario: Create a new user with valid data
    Given I have prepared data for a new user with name "Morpheus" and job "Leader"
    When I send the create user request
    Then the HTTP response is 201
    And the response contains the name "Morpheus" and job "Leader"
    And the response contains a newly generated user ID
    And the response contains a creation timestamp

  @write @create @positive @bulk
  Scenario: Create multiple users (from create_users.feature file)
    When I send a create request for the following users:
      | name     | job    |
      | Alice QA | Tester |
      | Bob Dev  | Dev    |
    Then all create requests are successful
    And I can verify that user "Alice QA" was created with job "Tester"
    And I can verify that user "Bob Dev" was created with job "Dev"

  @write @create @negative
  Scenario Outline: Creating a user with missing data (provider behavior)
    # ReqRes creează chiar și cu câmpuri goale → 201
    When I send the create user request with name "<name>" and job "<job>"
    Then the HTTP response is 201
    And the response contains a newly generated user ID
    And the response contains a creation timestamp
    And the response contains the name "<name>" and job "<job>"
    Examples:
      | name     | job    |
      | Morpheus |        |
      |          | Leader |
      |          |        |


  # ---- UPDATE ----
  @write @update @positive
  Scenario Outline: Fully update an existing user (PUT)
    Given I want to update user "<id>" with name "Neo" and job "The One"
    When I send a PUT request for user "<id>"
    Then the HTTP response is 200
    And the response contains the updated name "Neo" and job "The One"
    And the response contains an update timestamp
    Examples:
      | id |
      | 2  |

  @write @update @positive
  Scenario Outline: Partially update an existing user (PATCH)
    Given I want to update user "<id>" with only the job "Zion Resident"
    When I send a PATCH request for user "<id>"
    Then the HTTP response is 200
    And the response contains the updated job "Zion Resident"
    And the response contains an update timestamp
    Examples:
      | id |
      | 3  |

  @write @update @negative
  Scenario: Attempting to update a non-existent user (provider behavior)
    Given I want to update user "999" with only the job "Ghost"
    When I send a PATCH request for user "999"
    Then the HTTP response is 200
    And the response contains an update timestamp

  # ---- DELETE ----
  @write @delete @positive
  Scenario Outline: Delete an existing user
    When I send a delete request for user "<id>"
    Then the HTTP response is 204
    And the response has no content
    Examples:
      | id |
      | 2  |
      | 4  |

  @write @delete @negative
  Scenario: Attempting to delete a non-existent user (provider behavior)
    When I send a delete request for user "999"
    Then the HTTP response is 204
