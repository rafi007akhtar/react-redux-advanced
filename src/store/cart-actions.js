import { urls } from "../utils/constants";
import { uiActions } from "./ui-slice";
import { cleanFetch } from "../utils/apiUtils";
import { cartActions } from "./cart-slice";

/**
 * NOTE: A THUNK is an action creator.
 * It takes a state variable from the redux store, and returns the action function.
 * The action function can then be dispatched as needed in the code.
 * This will handle side-effects in a cleaner and decoupled way.
 *
 * This file contains all thunks aka action creators for the application.
 */

const { FIREBASE_URL, CART_JSON_SUFFIX } = urls;
const completeURL = `${FIREBASE_URL}${CART_JSON_SUFFIX}`;

export function sendCartDataThunk(cart) {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data.",
      })
    );

    const { items, totalQuantity } = cart;
    const [data, err] = await cleanFetch(completeURL, {
      method: "PUT",
      body: JSON.stringify({ items, totalQuantity }),
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

export function fetchCartDataThunk() {
  return async (dispatch) => {
    const [cartData, error] = await cleanFetch(completeURL);

    if (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Fetching cart data failed.",
        })
      );
      return;
    }

    cartData.items = cartData.items || [];
    dispatch(cartActions.replaceCart(cartData));
  };
}
