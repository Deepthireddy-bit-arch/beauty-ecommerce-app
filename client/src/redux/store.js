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
    
    ui: uiReducer,
  },
});

export default store;