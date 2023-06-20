import React from 'react';
//import { toMatchDiffSnapshot } from 'snapshot-diff';
import {cleanup, fireEvent, waitFor, render} from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import LoginForm from './LoginForm';

//expect.extend({ toMatchDiffSnapshot });
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

      return Promise.resolve(JSON.stringify({ data: 'Hello World' }));
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

  //expect(firstRender).toMatchDiffSnapshot(lastFragment)

  // Nettoyage des mocks
  fetchMock.mockReset();
});
