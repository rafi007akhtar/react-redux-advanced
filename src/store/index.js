import { configureStore } from "@reduxjs/toolkit";
import uiSlice, { uiActions } from "./ui-slice";
import cartSlice, { cartActions } from "./cart-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    cart: cartSlice.reducer
  },
});

export { uiActions, cartActions };

export default store;
