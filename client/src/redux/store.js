// // src/redux/store.js
// import { configureStore } from "@reduxjs/toolkit";
// import loginReducer    from "./slices/loginSlice";
// import registerReducer from "./slices/registerSlice"


// const store = configureStore({
//   reducer: {
//     login:    loginReducer,
//      register: registerReducer,
//     // register: registerReducer,
//     // add more reducers here as your app grows
//     // cart: cartReducer,
//   },
// });

// export default store;
import { configureStore } from "@reduxjs/toolkit";

// slices
import loginReducer from "./slices/loginSlice";
import registerReducer from "./slices/registerSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,

    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
});

export default store;