import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from '~/CommonComponent/GlobalStyle';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Router>
            <Provider store={store}>
                <GlobalStyle>
                    <App />
                </GlobalStyle>
            </Provider>
        </Router>
    // <React.StrictMode>
    // </React.StrictMode>,
);

reportWebVitals();
