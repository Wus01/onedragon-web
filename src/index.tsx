import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import {AuthProvider} from "./app/shared/AuthContext";

declare module 'react-dom' {
    export function render(element:any, container:any): void;
}

ReactDOM.render(
  <BrowserRouter basename="">
      <AuthProvider>
      <App />
      </AuthProvider>
  </BrowserRouter>,
    document.getElementById('root')
);


serviceWorker.unregister();