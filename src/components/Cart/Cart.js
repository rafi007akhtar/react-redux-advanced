import { useSelector } from "react-redux";
import Card from "../UI/Card";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";

const Cart = (props) => {
  const cart = useSelector((state) => state.cart);

  const cartItems = cart.items.map((cartItem) => (
    <CartItem
      key={cartItem.itemId}
      item={{
        title: cartItem.name,
        quantity: cartItem.quantity,
        total: cartItem.totalPrice,
        price: cartItem.price,
        id: cartItem.itemId
      }}
    />
  ));

  return (
    <Card className={classes.cart}>
      <h2>Your Shopping Cart</h2>
      <ul>{cartItems}</ul>
    </Card>
  );
};

export default Cart;
