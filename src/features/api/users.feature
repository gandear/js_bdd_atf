# features/api/users.feature
@api @users
Feature: Users API

  # ---- READ ----
  @read
  Scenario Outline: List users for page <page>
    When I fetch users page <page>
    Then a users list is returned
  Examples:
    | page |
    | 1    |
    | 2    |

  @read
  Scenario Outline: Get existing user by id <id>
    When I fetch user with id "<id>"
    Then a single user is returned
  Examples:
    | id |
    | 1  |
    | 2  |
    | 3  |
    | 4  |
    | 5  |
    | 6  |

  @read
  Scenario Outline: Get non-existing user by id <id>
    When I fetch user with id "<id>"
    Then the user is not found
  Examples:
    | id  |
    | 23  |
    | 999 |
    | 0   |
    | -1  |

  # ---- WRITE ----
  @write
  Scenario: Create a random user
    When I create a random user
    Then the user is created

  @write
  Scenario Outline: Update user <id> with a new job
    When I update user "<id>" with a new job
    Then the user is updated
  Examples:
    | id |
    | 1  |
    | 2  |
    | 3  |

  @write
  Scenario Outline: Delete user <id>
    When I delete user "<id>"
    Then the user is deleted
  Examples:
    | id |
    | 1  |
    | 2  |
    | 3  |
