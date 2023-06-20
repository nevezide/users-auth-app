import React from 'react';
import {useState} from 'react';

export default function LoginForm(props) {
  const [error, setError] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    return fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        login,
        password
      })
    })
    .then((res) => {
      if (res.ok) {
        props.onLogged();
      } else {
        setError('Login / Password Incorrect')
      }
    })
    .catch(() => setError('An error occurs on login'));
  };

  return (
    <section className="form">
      <div className="error">{error}</div>
      <label htmlFor='login'>Login</label>
      <input type='text' id='login' name='login' placeholder='Votre email ou pseudo' onChange={(event) => setLogin(event.target.value)} value={login} />
      <label htmlFor='password'>Mot de passe</label>
      <input type='password' id='password' name='password' placeholder='Votre mot de passe' onChange={(event) => setPassword(event.target.value)} value={password} />
      <button onClick={onLogin}>S'identifier</button>
    </section>
  );
}
