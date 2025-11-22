import { memo, useMemo } from "react";
import { useSelector } from "react-redux";

function Header() {
    const userInfo = useSelector((state: any) => state.user.userInfo);

    const userInitial = useMemo(() => userInfo?.name.charAt(0) || 'U', [userInfo?.name]);

  return (
    <nav>
        <div className='flex items-center justify-between p-4 bg-[#f6f6f6] border-b-2 border-zinc-200'>
            <h1 className='font-bold text-xl flex items-center'> 
                <span className="p-2 bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white rounded-md mr-2 hover:">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame-icon lucide-flame"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>
                </span>
                Product Inventory Dashboard
              </h1>

            <div className="border-2 border-zinc-300 py-2 px-2 rounded-full">
                <span className=" bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white rounded-full p-1 px-2">{userInitial}</span> {userInfo?.name}
            </div>
        </div>
    </nav>
  )
}

export default memo(Header)
