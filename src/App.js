import { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uiActions } from "./store";
import Notification from "./components/UI/Notification";

const FIREBASE_URL = "https://react-http-1e532-default-rtdb.firebaseio.com/";
const CART_JSON_SUFFIX = "cart.json";
const completeURL = `${FIREBASE_URL}${CART_JSON_SUFFIX}`;

let initialLoad = true;

/**
 * A cleaner way to use the fetch API that does not involve any kind of nesting.
 * It takes the regular params of a fetch API and returns an array with data and error.
 * If the second element, error, is undefined, it means the API call is successful, and you can use the data.
 * Otherwise, the error occured is sent in the returned array, and data remains undefined.
 * You can then use this error to handle the it.
 * **NOTE:** This is an async function, so make sure to use `await` while calling it.
 * @param {string} url the URL to call with the fetch API
 * @param {RequestInit} params the params that go inside the fetch API
 * @param {'json' | 'text'} resType (optional) this kind of response will be sent in the data element of the returned array. By default it is json, but can be changed to text.
 * @returns {Promise<any[]>} an array with two elements: the first being the data during a successful call, and the second being the error during an unsuccessful call.
 */
async function cleanFetch(url, params, resType = "json") {
  let data, err;
  try {
    const response = await fetch(url, params);
    const result =
      resType === "json" ? await response.json() : await response.text();
    data = result;
  } catch (e) {
    err = e;
  }
  return [data, err];
}

function App() {
  const ui = useSelector((state) => state.ui);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    // NOTE: you should NOT make the parent useEffect function async
    // so we're writing a new function, making that async, and calling that instead
    async function updateCart() {
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
    }

    // don't send HTTP request on page load, because it will override the stored data
    if (initialLoad) {
      initialLoad = false;
      return;
    }

    updateCart();
  }, [
    cart,
    dispatch, // NOTE: no need to memoize dispatch because Redux makes sure it doesn't change
  ]);

  return (
    <>
      {ui.notification && (
        <Notification
          title={ui.notification.title}
          message={ui.notification.message}
          status={ui.notification.status}
        />
      )}
      <Layout>
        {ui.isCartVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
