import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { SiteDataProvider } from './context/SiteDataContext.jsx'
import './components/common/Reveal.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteDataProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SiteDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
