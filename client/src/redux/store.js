import { configureStore } from "@reduxjs/toolkit";

// slices
import loginReducer from "./slices/loginSlice";
import registerReducer from "./slices/registerSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import uiReducer from "./slices/uiSlice";
import productReducer from './slices/productSlice';
import productDetailReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import profileReducer from "./slices/profileSlice";
import brandReducer from './slices/brandSlice';
import homeReducer from './slices/homeSlice'
import dealsReducer from "./slices/dealsSlice";
import categoryBannerReducer from "./slices/categoryBannerSlice";
import collectionsReducer from "./slices/collectionsSlice";
import brandsReducer from "./slices/brandpageSlice";
const store = configureStore({
  reducer: {
    login: loginReducer,
    products: productReducer,
    register: registerReducer,
    productDetail: productDetailReducer,
    //landing page
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    profile: profileReducer,
    brands: brandReducer,
    ui: uiReducer,
    home: homeReducer,
    deals: dealsReducer,
    categoryBanners: categoryBannerReducer,
    collections: collectionsReducer,
    brands: brandsReducer,
  },
});

export default store;