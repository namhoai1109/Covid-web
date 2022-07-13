import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from '~/CommonComponent/GlobalStyle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Router>
            <GlobalStyle>
                <App />
            </GlobalStyle>
        </Router>
    // <React.StrictMode>
    // </React.StrictMode>,
);

reportWebVitals();
