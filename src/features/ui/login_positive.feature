@ui @login
Feature: Login with Valid Credentials
  As a user
  I want to log in to the OrangeHRM application
  So that I can access the dashboard

Background:
  Given I am on the OrangeHRM login page

@positive
Scenario: Login with valid credentials
  When I log in with username "Admin" and password "admin123"
  Then I should see the dashboard