import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  brand?: string;
  stock?: number;
}

export interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalStock: number;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  totalProducts: 0,
  totalCategories: 0,
  totalBrands: 0,
  totalStock: 0,
};


const loadProductsFromLocalStorage = (): Product[] => {
  try {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
    return [];
  }
};


const calculateTotals = (products: Product[]) => {
  const totalProducts = products.length;
  const uniqueCategories = new Set(products.map(p => p.category));
  const totalCategories = uniqueCategories.size;
  const uniqueBrands = new Set(products.map(p => p.brand).filter(Boolean));
  const totalBrands = uniqueBrands.size;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  
  return { totalProducts, totalCategories, totalBrands, totalStock };
};


const saveProductsToLocalStorage = (products: Product[]): void => {
  try {
    localStorage.setItem('products', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

export const fetchProducts = createAsyncThunk<Product[], void>('products/fetch', async () => {
  const response = await fetch('https://dummyjson.com/products?limit=100');
  const data = await response.json();
  return data.products;
});

export const productSlice = createSlice({
  name: 'product',
  initialState: (() => {
    const loadedItems = loadProductsFromLocalStorage();
    const totals = calculateTotals(loadedItems);
    return {
      ...initialState,
      items: loadedItems,
      ...totals,
    };
  })(),
  reducers: {
    
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
      saveProductsToLocalStorage(state.items);
      state.totalProducts = state.items.length;
    },
    

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveProductsToLocalStorage(state.items);
      }
    },
    
   
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      saveProductsToLocalStorage(state.items);
      
     
      state.totalProducts = state.items.length;
      const uniqueCategories = new Set(state.items.map(p => p.category));
      state.totalCategories = uniqueCategories.size;
      const uniqueBrands = new Set(state.items.map(p => p.brand).filter(Boolean));
      state.totalBrands = uniqueBrands.size;
      state.totalStock = state.items.reduce((sum, p) => sum + (p.stock || 0), 0);
    },
    
    
    updateProductStock: (state, action: PayloadAction<{ id: number; stock: number }>) => {
      const product = state.items.find(p => p.id === action.payload.id);
      if (product) {
        product.stock = action.payload.stock;
        saveProductsToLocalStorage(state.items);
      
        state.totalStock = state.items.reduce((sum, p) => sum + (p.stock || 0), 0);
      }
    },
    
  
    clearProducts: (state) => {
      state.items = [];
      localStorage.removeItem('products');
      state.totalProducts = 0;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        saveProductsToLocalStorage(action.payload);
        
       
        state.totalProducts = action.payload.length;
        
        
        const uniqueCategories = new Set(action.payload.map(p => p.category));
        state.totalCategories = uniqueCategories.size;
        
        
        const uniqueBrands = new Set(action.payload.map(p => p.brand).filter(Boolean));
        state.totalBrands = uniqueBrands.size;
        
        state.totalStock = action.payload.reduce((sum, p) => sum + (p.stock || 0), 0);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An error occurred';
      });
  },
});

export const { addProduct, updateProduct, deleteProduct, updateProductStock, clearProducts } = productSlice.actions;

export default productSlice.reducer;

