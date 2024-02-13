import { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uiActions } from "./store";
import Notification from "./components/UI/Notification";
import { cleanFetch } from "./utils/apiUtils";

const FIREBASE_URL = "https://react-http-1e532-default-rtdb.firebaseio.com/";
const CART_JSON_SUFFIX = "cart.json";
const completeURL = `${FIREBASE_URL}${CART_JSON_SUFFIX}`;

let initialLoad = true;

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
