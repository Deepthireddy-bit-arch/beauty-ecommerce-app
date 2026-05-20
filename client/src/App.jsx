import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";          // ✅ import Toaster
import store from "./redux/store";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/productdetails/Productdetailpage";
import CartPage from './pages/cartdetails/CartPage';
import WishlistPage from "./pages/wishlist/WishlistPage";
import StepperPage from "./pages/productdetails/Stepperpage";

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />               {/* ✅ add this line */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkoutpage" element={<StepperPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;