import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './pages/Dashboard';
import {Tab} from './components/Tab'
import reportWebVitals from './reportWebVitals';
import { Settings } from './pages/Settings';
import { ListData } from './pages/ListData';
import { Statistics } from './pages/Statistics';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Tab _tabs={[
      { Component: Dashboard, title: 'Dashboard' },
      { Component: ListData, title: 'All data' },
      { Component: Statistics, title: 'Statistics' },
      { Component: Settings, title: 'Settings' }
    ]}></Tab>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
