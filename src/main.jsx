import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Removed import './index.css' as styles are now in App.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
