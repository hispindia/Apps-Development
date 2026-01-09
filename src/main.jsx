import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { CustomDataProvider, Provider } from "@dhis2/app-runtime";

createRoot(document.getElementById('root')).render(<App />)
