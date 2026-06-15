import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";          // ✅ import Toaster
import store from "./redux/store";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";

import ProductDetailPage from "./pages/productdetails/Productdetailpage";
import CartPage from './pages/cartdetails/CartPage';
import WishlistPage from "./pages/wishlist/WishlistPage";
import StepperPage from "./pages/productdetails/Stepperpage";
import Profile from "./pages/profiledetails/ProfilePage";
import CollectionsPage from "./pages/collections/CollectionsPage";
import BrandsPage from "./pages/brands/BrandsPage";
import SearchPage from "./pages/search/SearchPage";
import ProductsPage from "./pages/products/ProductsPage";
import CollectionSingleView from "./pages/collections/CollectionsSingleView";
import BrandDetails from "./pages/brands/BrandDetails";
import MainLayout from "./layouts/MainLayout";




function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />               {/* ✅ add this line */}
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkoutpage" element={<StepperPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/collections/:id" element={<CollectionSingleView />} />
            <Route path="/brands/:id" element={<BrandDetails />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;