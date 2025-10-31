import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import './globals.css';

// Get the root element
const container = document.getElementById('root');

// Create a root and render the app
const root = ReactDOM.createRoot(container);
root.render(<App />);
