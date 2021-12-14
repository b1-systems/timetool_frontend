import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Timelog from './components/Timelog';

function App() {
  return (
    <BrowserRouter basename={globalThis.horde.appWebroot}>
        <Timelog></Timelog>
    </BrowserRouter>
  );
}

export default App;
