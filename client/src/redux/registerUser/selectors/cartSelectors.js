//selectors mainly used for cart page ,but can be used anywhere in the app to get the cart details 
const selectItems = (s) => s.cart.items; 
const selectCoupon = (s) => s.cart;
const selectTotals = (s) => {
  const items = s.cart.items;
  const mrp = items.reduce((a, i) => a + i.originalPrice * i.quantity, 0);
  const payable = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const discount = mrp - payable;
  const couponOff = s.cart.couponDiscount;
  return { mrp, payable: payable - couponOff, discount, couponOff, itemCount: items.length };
};
export { selectItems, selectCoupon, selectTotals };