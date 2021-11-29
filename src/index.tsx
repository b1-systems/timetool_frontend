import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

window.onload = () => {
  if (!globalThis.horde) {
    globalThis.horde = window.horde || {
      appMode: 'mock',
      sessionToken: '1ccAAAAAAcA1cAA-AcAcyA1',
      currentApp: 'coronado',
      userUid: 'mockuser1',
      appWebroot: process.env.PUBLIC_URL,
      languageKey: 'en_US',
      supportedLanguages: {de_DE: 'Deutsch'},
    };
  }
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
  );
};
