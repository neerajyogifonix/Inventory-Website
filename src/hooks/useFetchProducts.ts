import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import type { RootState, AppDispatch } from '../store/store';

export const useFetchProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalProducts, totalCategories, totalBrands, totalStock, status, error } = useSelector(
    (state: RootState) => state.product,
    (prev, next) => {
      return (
        prev.items === next.items &&
        prev.status === next.status &&
        prev.totalProducts === next.totalProducts &&
        prev.totalCategories === next.totalCategories &&
        prev.totalBrands === next.totalBrands &&
        prev.totalStock === next.totalStock &&
        prev.error === next.error
      );
    }
  );

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  return useMemo(
    () => ({
      items,
      totalProducts,
      totalCategories,
      totalBrands,
      totalStock,
      status,
      error,
    }),
    [items, totalProducts, totalCategories, totalBrands, totalStock, status, error]
  );
};
