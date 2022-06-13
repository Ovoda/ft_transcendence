import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientSocket from 'services/websocket.service';
import App from './App';
import store from './app/store';
import TfaLogin from './components/auth/TfaLogin';

const mainSocket = new ClientSocket();

export const mainSocketContext = createContext<null | ClientSocket>(null);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <mainSocketContext.Provider value={mainSocket}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/tfa' element={<TfaLogin />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </mainSocketContext.Provider>
);