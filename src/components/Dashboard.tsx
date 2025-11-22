import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFetchProducts } from "../hooks/useFetchProducts";

const StatCard = memo(({ item, index }: { item: any; index: number }) => (
  <div
    key={index}
    style={{ borderColor: item.color }}
    className="flex items-center p-2 h-28 w-full md:w-[calc(50%-0.5rem)]  mt-1 bg-gradient-to-r from-[#fdf6e3]/50 via-[#eaeaff]/50 to-[#f7ecff]/50 border rounded-2xl shadow-lg transition transform"
  >
    <div>
      <svg
        className="h-16 w-16 md:h-20 md:w-20 mr-2 opacity-80 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={item.color}
      >
        <path d="M10.9999 2.04938L11 5.07088C7.6077 5.55612 5 8.47352 5 12C5 15.866 8.13401 19 12 19C13.5723 19 15.0236 18.4816 16.1922 17.6064L18.3289 19.7428C16.605 21.1536 14.4014 22 12 22C6.47715 22 2 17.5228 2 12C2 6.81468 5.94662 2.55115 10.9999 2.04938ZM21.9506 13.0001C21.7509 15.0111 20.9555 16.8468 19.7433 18.3283L17.6064 16.1922C18.2926 15.2759 18.7595 14.1859 18.9291 13L21.9506 13.0001ZM13.0011 2.04948C17.725 2.51902 21.4815 6.27589 21.9506 10.9999L18.9291 10.9998C18.4905 7.93452 16.0661 5.50992 13.001 5.07103L13.0011 2.04948Z"></path>
      </svg>
    </div>

    <div>
      <h3 style={{ color: item.color }} className="text-xl sm:text-2xl font-bold drop-shadow-sm">
        {item.title}
      </h3>
      <h3 style={{ color: item.color }} className="text-2xl sm:text-3xl font-extrabold drop-shadow-sm">
        {item.num}
      </h3>
    </div>
  </div>
));

const ProductCard = memo(({ item }: { item: any }) => (
  <div className="product-card">
    <div className="flex flex-col justify-between p-4 mb-4 bg-white h-full rounded-lg shadow-md hover:shadow-lg transition">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="h-32 w-32 object-contain mx-auto flex-shrink-0 "
      />
      <div className="flex justify-between items-center mt-2">
        <h3 className="text-lg font-semibold">{item.title}</h3> 
        <p className="text-gray-600">Category:{item.category}</p>
      </div>
      <div className="text-right">  
        <p className="text-xl font-bold text-indigo-600">${item.price}</p>
      </div>
    </div>
  </div>
));

function Dashboard() {
  const { items, totalProducts, totalCategories, totalBrands, totalStock, status } = useFetchProducts();

  const itemsNumbers = useMemo(
    () => [
      { title: "Total Products", num: totalProducts, color: "#4F46E5" },
      { title: "Total Categories", num: totalCategories, color: "#16A34A" },
      { title: "Total Brands", num: totalBrands, color: "#DC2626" },
      { title: "Total Stock", num: totalStock, color: "#D97706" },
    ],
    [totalProducts, totalCategories, totalBrands, totalStock]
  );

  const topSellingItems = useMemo(() => items.slice(0, 20), [items]);

  return (
    <div id="dashboard" className="px-4 md:px-10 mb-32">
     
      <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md flex-wrap">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-18v6h8V3h-8zm-10 8v8h8v-8H3z" />
        </svg>
        <h1 className="text-2xl font-bold tracking-wide flex-shrink-0">Dashboard <Link to="/inventory" className="md:hidden p-2 ml-2 border-2 rounded-lg hover:bg-purple-300 hover:text-white transition-all">Inventory</Link></h1>
      </div>

      
      {status === 'loading' && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading...</span>
        </div>
      )}

     
      {status !== 'loading' && (
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mt-5">
          {itemsNumbers.map((item, index) => (
            <StatCard key={index} item={item} index={index} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md flex-wrap mt-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>
        <h1 className="text-2xl font-bold tracking-wide flex-shrink-0">Top Sellings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {topSellingItems.map((item, index) => (
          <ProductCard key={item.id || index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default memo(Dashboard);
