import { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store/slices/userSlice';

const pages = ["dashboard", "inventory"]

const NavLink = memo(({ item, index }: { item: string; index: number }) => (
  <Link
    key={index}
    to={`/${item}`}
    className='flex gap-2 p-4 rounded-lg hover:bg-white hover:font-semibold transition-all'
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
    {item.charAt(0).toUpperCase() + item.slice(1)}
  </Link>
));

function Sidebar() {
  const dispatch = useDispatch();
  const navPages = useMemo(() => pages, []);


  return (
    <aside className='hidden md:block w-52 h-full overflow-hidden border-r-2 border-zinc-200'>
    <div className='pt-10 flex flex-col justify-between h-full'>
        <div className='flex flex-col px-2'>
            {navPages.map((item, index) => (
                <NavLink key={index} item={item} index={index} />
            ))}
        </div>

        <div className='w-full mb-24 px-2'>
          <button className='bg-red-600 text-white w-full rounded-md py-3' onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>
    </div>
            </aside>
  )
}

export default memo(Sidebar)