import { lazy, memo, Suspense } from 'react';
import { Outlet } from 'react-router-dom'
const Sidebar =  lazy(() => import('../components/Sidebar'));
const Header =  lazy(() => import('../components/Header'));

const LayoutLoadingFallback = () => (
  <div className='w-full h-96 flex justify-center items-center'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
  </div>
);

function InventoryLayout() {
  return (
     <div className='h-screen w-full overflow-hidden bg-[#f6f6f6]'>
        <header>
          <Header />
        </header>
        <div className='h-full flex gap-5 bg-[#f6f6f6]'>
          <Suspense fallback={<div className='w-52'></div>}>
            <Sidebar />
          </Suspense>
          <main className='p-5  w-full overflow-y-auto '>
            <Suspense fallback={<LayoutLoadingFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
  )
}

export default memo(InventoryLayout)