Feature: Login functionality

  As a user
  I want to login into the system
  so that I can start working with it.

  Scenario: User gets a token after logged in
    Given a real username and password
    When try to sign in
    Then a token is returned
    And token includes the id
    And token includes the username
    But token does not include the password

  Scenario: User not found
    Given username and password
    When try to sign in
    Then user receives a "Forbidden" error

  Scenario: User password mismatch
    Given username and password
    When try to sign in
    Then user receives a "Forbidden" error
