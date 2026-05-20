import React, { useState } from 'react';
import { Provider } from 'react-redux';
import  store  from '../../redux/store';
import './orderspage.css';

import Navbar from './Navbar';
import CheckoutPage from './Checkoutpage';
import OrderConfirmationModal from './OrderconfirmationModal';
import MyOrdersPage from './Myorderspage';

const StepperPage = () => {
  const [page, setPage] = useState('checkout');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleOrderSuccess = (order) => {
    setConfirmedOrder(order);
  };

  const handleCloseModal = () => setConfirmedOrder(null);

  return (
    <>
      <Navbar activePage={page} onNavigate={setPage} />

      {page === 'checkout' && (
        <CheckoutPage onOrderSuccess={handleOrderSuccess} />
      )}

      {page === 'myorders' && <MyOrdersPage />}

      {/* Confirmation modal overlays whatever page is active */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onViewOrders={() => { handleCloseModal(); setPage('myorders'); }}
          onContinueShopping={handleCloseModal}
        />
      )}
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <StepperPage />
  </Provider>
);

export default StepperPage;