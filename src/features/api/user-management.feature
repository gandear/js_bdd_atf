@api @users
Feature: User Management (API)

  Background:
    Given I am logged in as a valid user

  # ---- READ (Public) ----
  @read @public
  Scenario Outline: List users for a specific page
    When I send an unauthenticated GET request to "/api/users?page=<page>"
    Then the HTTP response is 200
    And the response contains correct pagination metadata for page <page>
    Examples:
      | page |
      | 1    |
      | 2    |

  # ---- CREATE (Implicit public, dar în API-uri reale ar fi securizat) ----
  @write @create @positive
  Scenario: Create a new user with valid data
    When I create a new user with name "Morpheus" and job "Leader"
    Then the HTTP response is 201
    And the response contains the name "Morpheus" and job "Leader"
    And the response contains a newly generated user ID
    
  # ---- DELETE (Securizat logic) ----
  @write @delete @secure
  Scenario: Delete an existing user (Requires Auth)
    When I send an authenticated DELETE request to "/api/users/2"
    Then the HTTP response is 204
    And the response has no content