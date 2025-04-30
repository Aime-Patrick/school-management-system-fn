import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { PrimeReactProvider } from 'primereact/api';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/primereact.min.css';
import { SubscriptionProvider } from './utils/subscriptionContext.jsx'
        
const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SubscriptionProvider>
    <PrimeReactProvider>
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-left"
        toastOptions={{
          className: 'toast',
          style: {
            borderRadius: '5px',
            backgroundColor: '#ffffff',
            color: 'black',
          },
          iconTheme:{
            'success': 'pi pi-check-circle',
            'error': 'pi pi-times-circle',
            'info': 'pi pi-info-circle',
            'warning': 'pi pi-exclamation-circle'
          }
        }}
      />
      <App />
    </QueryClientProvider>
    </PrimeReactProvider>
    </SubscriptionProvider>
  </StrictMode>,
)
