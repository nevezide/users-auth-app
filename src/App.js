import React from 'react';
import {useState} from 'react';

import logo from './logo.svg';
import './App.css';
import LoginForm from './components/LoginForm.js';

function App() {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        {isLogged && <div className="message">Connecté avec succès</div>}
        {!isLogged && <LoginForm onLogged={() => setIsLogged(true)} />}
      </main>
    </div>
  );
}

export default App;
