// import { BrowserRouter, Routes, Route } from "react-router-dom";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage  from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;