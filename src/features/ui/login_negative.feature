@ui @login
Feature: Login with Invalid or Missing Credentials
  As a user
  I want to receive appropriate error messages
  So that I can correct my login attempt

Background:
  Given I am on the OrangeHRM login page

@negative
Scenario Outline: Login attempt with invalid or missing credentials
  When I log in with username "<username>" and password "<password>"
  Then I should see the error message "<error_message>"

  Examples:
    | username  | password  | error_message          |
    | Admin     | 123       | Invalid credentials    |
    | invalid   | admin123  | Invalid credentials    |
    |           | admin123  | Required               |
    | Admin     |           | Required               |
    |           |           | Required               |