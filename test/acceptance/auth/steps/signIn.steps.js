const { defineFeature, loadFeature } = require('jest-cucumber');
const featureSignIn = loadFeature('test/acceptance/auth/features/signIn.feature');
const jsonwebtoken = require('jsonwebtoken');
const DATA = require('test/config/models');
const setup = require('../auth.setup');

defineFeature(featureSignIn, test => {
  let repository = null;
  let service = null;

  beforeEach(setup.onBeforeEach((rep, ser) => {
    repository = rep;
    service = ser;
  }));

  test('User gets a token after logged in', ({ given, when, then }) => {
    let username, password, result = null;

    given('a real username and password', () => {
      jest.spyOn(repository, 'getUserByUsernameWithRoles').mockResolvedValue({ ...DATA.user });
      username = DATA.user.username;
      password = 'PASSword.2119';
    });

    when('try to sign in', async () => {
      result = await service.signIn({ username, password });
    });

    then('a token is returned', () => {
      expect(result).toBeJsonWebToken();
      result = jsonwebtoken.verify(result, process.env.JWT_SECRET);
    });

    then('token includes the id', () => {
      expect(result.id).toBeDefined();
    });

    then('token includes the username', () => {
      expect(result.username).toBeDefined();
    });

    then('token does not include the password', () => {
      expect(result.password).not.toBeDefined();
    });
  });

  test('User not found', ({ given, when, then }) => {
    let username, password, result;

    given('username and password', () => {
      username = 'ncardez';
      password = 'Ndez_999';
    });

    when('try to sign in', () => {
      return service.signIn({ username, password }).catch(e => { result = e; });
    });

    then('user receives a "Forbidden" error', () => {
      expect(result).toBeError();
      expect(result.message).toContain('Forbidden');
    });
  });

  test('User password mismatch', ({ given, when, then }) => {
    let username, password, result;

    given('username and password', () => {
      jest.spyOn(repository, 'getUserByUsernameWithRoles').mockResolvedValue({ ...DATA.user });
      username = DATA.user.username;
      password = 'jsknksnksfn';
    });

    when('try to sign in', () => {
      return service.signIn({ username, password }).catch(e => { result = e; });
    });

    then('user receives a "Forbidden" error', () => {
      expect(result).toBeError();
      expect(result.message).toContain('Forbidden');
    });
  });
});
