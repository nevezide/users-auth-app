import React from 'react';
import { toMatchDiffSnapshot } from 'snapshot-diff';
import {cleanup, fireEvent, waitFor, render, screen} from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import LoginForm from './LoginForm';

expect.extend({ toMatchDiffSnapshot });
fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

// Remarque : l'exécution du nettoyage afterEach se fait automatiquement pour vous dans @testing-library/react@9.0.0 ou une version supérieure.
// Démonte et nettoie le DOM après que le test soit terminé.
afterEach(cleanup);

it('Show Login form', () => {
  const isLogged = false;
  const component = render(
    <LoginForm isLogged={isLogged} />,
  );

  expect(component.container).toMatchSnapshot()
});

it('Login succeed', async () => {
  const onLogged = jest.fn();
  const { getByRole, getByLabelText, asFragment } = render(
    <LoginForm onLogged={onLogged} />,
  );
  fetchMock.mockResponseOnce((req) => {
    try {
      expect(req.url).toBe('http://localhost:3000/login');
      expect(req.method).toBe('POST');
      expect(req.headers.get('Content-Type')).toBe('application/json');
      expect(JSON.parse(req.body)).toStrictEqual({ login: 'nevezide', password: 'nevezide' });

      // Doesn't work with resolve void, I don't know why
      return Promise.resolve({});
    } catch(error) {
      console.error(error);
      throw error;
    }
  });
  const firstRender = asFragment();

  fireEvent.change(getByLabelText(/login/i), {target: {value: 'nevezide'}})
  fireEvent.change(getByLabelText(/mot de passe/i), {target: {value: 'nevezide'}})
  fireEvent.click(getByRole('button'));

  await waitFor(() => expect(onLogged).toHaveBeenCalledTimes(1));

  const lastFragment = asFragment();

  expect(firstRender).toMatchDiffSnapshot(lastFragment)
});

it('Login fail', async () => {
  const onLogged = jest.fn();
  const { getByRole, getByLabelText, asFragment } = render(
    <LoginForm onLogged={onLogged} />,
  );
  fetchMock.mockResponseOnce((req) => {
    return Promise.resolve({
      error: 'Login fail'
    });
  }, {
    status: 403
  });
  const firstRender = asFragment();

  fireEvent.change(getByLabelText(/login/i), {target: {value: 'nevezide'}})
  fireEvent.change(getByLabelText(/mot de passe/i), {target: {value: 'incorrect'}})
  fireEvent.click(getByRole('button'));

  await screen.findByText('Login / Password Incorrect');
  expect(onLogged).toHaveBeenCalledTimes(0);

  const lastFragment = asFragment();

  expect(firstRender).toMatchDiffSnapshot(lastFragment)
});

it('Error on login', async () => {
  const onLogged = jest.fn();
  const { getByRole, getByLabelText, asFragment } = render(
    <LoginForm onLogged={onLogged} />,
  );
  fetchMock.mockResponseOnce((req) => {
    return Promise.reject({
      error: 'Erreur'
    });
  });
  const firstRender = asFragment();

  fireEvent.change(getByLabelText(/login/i), {target: {value: 'nevezide'}})
  fireEvent.change(getByLabelText(/mot de passe/i), {target: {value: 'nevezide'}})
  fireEvent.click(getByRole('button'));

  await screen.findByText('An error occurs on login');
  expect(onLogged).toHaveBeenCalledTimes(0);

  const lastFragment = asFragment();

  expect(firstRender).toMatchDiffSnapshot(lastFragment)
});
