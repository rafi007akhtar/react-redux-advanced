import { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Notification from "./components/UI/Notification";
import { fetchCartDataThunk, sendCartDataThunk } from "./store/cart-actions";

let initialLoad = true;

function App() {
  const ui = useSelector((state) => state.ui);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    // on page load, show the previously added cart items
    const fetchCardDataAction = fetchCartDataThunk();
    dispatch(fetchCardDataAction);
  }, [dispatch]);

  useEffect(() => {
    // NOTE: you should NOT make the parent useEffect function async
    // so we're writing a new function, making that async, and calling that instead

    // don't send HTTP request on page load, because it will override the stored data
    if (initialLoad) {
      initialLoad = false;
      return;
    }

    if (!cart.changed) {
      return;
    }

    const sendCardDataAction = sendCartDataThunk(cart);
    dispatch(sendCardDataAction);
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
