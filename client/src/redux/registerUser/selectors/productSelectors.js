/* -------------------------
   SELECT FILTERED CATEGORIES
--------------------------*/
// export const selectCategories = (state) => {
//   const cats = [...new Set(state.products.items.map(p => p.category))];
//   return ['All', ...cats];
// };
export const selectCategories = (state) => {
  const products = state.products.items ?? [];
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
  return cats; // Don't include 'All' here, ProductsPage adds it
};

/* -------------------------
   SELECT PRODUCTS
--------------------------*/
export const selectProducts = (state) => state.products.items;

export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;

/* -------------------------
   FILTER STATE SELECTORS
--------------------------*/
export const selectFilters = (state) => ({
  search: state.products.searchQuery,
  category: state.products.selectedCategory,
  sort: state.products.sortBy,
  page: state.products.page
});