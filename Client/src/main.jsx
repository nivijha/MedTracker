import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "./components/ui/provider"
import App from './App.jsx';
import './index.css';
import {BrowserRouter as Router, Link, Routes, Route, BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider>
    <App />
    </Provider>
    </BrowserRouter>
  </StrictMode>
);