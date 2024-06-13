import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from './routes';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Suspense fallback={""}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {privateRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <App>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Component />
                  </Suspense>
                </App>
              }
            ></Route>
          ))}
          {publicRoutes.map(({ path, Component }) => (
            <>
              <Route
                key={path}
                path={path}
                element={
                  <Suspense fallback={<div>Loading...</div>}><Component /></Suspense>
                }
              ></Route>
              <Route path="/" element={<Navigate to="/" />} />
            </>
          ))}
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.Suspense>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
