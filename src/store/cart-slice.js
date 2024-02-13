import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";
import { cleanFetch } from "../utils/apiUtils";
import { urls } from "../utils/constants";

const { FIREBASE_URL, CART_JSON_SUFFIX } = urls;
const completeURL = `${FIREBASE_URL}${CART_JSON_SUFFIX}`;

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    addItemToCart(state, action) {
      state.totalQuantity++;
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.itemId === newItem.id
      );
      if (!existingItem) {
        state.items.push({
          itemId: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += existingItem.price;
      }
    },

    removeItemFromCart(state, action) {
      state.totalQuantity--;
      const id = action.payload;
      const existingItemId = state.items.findIndex(
        (item) => item.itemId === id
      ); // assumption: the index is never -1
      const existingItem = state.items[existingItemId];
      if (existingItem.quantity === 1) {
        state.items.splice(existingItemId, 1);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }
    },
  },
});

export const cartActions = cartSlice.actions;

/**
 * NOTE: A THUNK is an action creator.
 * It takes a state variable from the redux store, and returns the action function.
 * The action function can then be dispatched as needed in the code.
 * This will handle side-effects in a cleaner and decoupled way.
 */
export function sendCartDataThunk(cart) {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data.",
      })
    );

    const [data, err] = await cleanFetch(completeURL, {
      method: "PUT",
      body: JSON.stringify(cart),
    });

    if (err || !data) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Sending cart data failed.",
        })
      );
      return;
    }

    dispatch(
      uiActions.showNotification({
        status: "success",
        title: "Success",
        message: "Sending cart data successful",
      })
    );
  };
}

export default cartSlice;
