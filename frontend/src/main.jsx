import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'; // <-- ÚJ IMPORT
import { store } from './store/store'; // <-- ÚJ IMPORT
import App from './App';
import { ModalProvider } from './context/ModalContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* <-- PROVIDER HOZZÁADÁSA */}
      <BrowserRouter>
        <ModalProvider>
          <App />
        </ModalProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);