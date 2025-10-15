Feature: Create users from DataTable
  @smoke @users
  Scenario: Create multiple users via DataTable
    When I create users from table
      | name       | job     | email                 |
      | Alice QA   | Tester  | alice.qa@example.com  |
      | Bob Dev    | Dev     | bob.dev@example.com   |
    Then the table users are created
