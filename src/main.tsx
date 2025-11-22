import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './store/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

const LoadingFallback = () => (
  <div className='h-screen w-full flex justify-center items-center bg-[#f6f6f6]'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <div className='h-screen overflow-hidden'>
    <BrowserRouter>
      <StrictMode>
        <Provider store={store}>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </Provider>
      </StrictMode>
    </BrowserRouter>
  </div>
)
