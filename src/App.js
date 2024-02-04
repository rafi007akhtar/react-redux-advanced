import { useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector } from "react-redux";

const FIREBASE_URL = "https://react-http-1e532-default-rtdb.firebaseio.com/";
const CART_JSON_SUFFIX = "cart.json";
const completeURL = `${FIREBASE_URL}${CART_JSON_SUFFIX}`;

function App() {
  const ui = useSelector((state) => state.ui);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    fetch(completeURL, {
      method: "PUT",
      body: JSON.stringify(cart),
    });
  }, [cart]);

  return (
    <Layout>
      {ui.isCartVisible && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
