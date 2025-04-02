import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-left"
        toastOptions={{
          className: 'toast',
          style: {
            borderRadius: '5px',
            backgroundColor: '#3490ff',
            color: 'black',
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
