import ProductItem from "./ProductItem";
import classes from "./Products.module.css";

const DUMMY_PRODUCTS = [
  {
    id: "p1",
    title: "Apple",
    price: 6,
    description: "The fruit, not the expensive thingy",
  },
  {
    id: "p2",
    title: "Orange",
    price: 5,
    description: "Too lazy to write a description",
  },
];

const Products = (props) => {
  const products = DUMMY_PRODUCTS.map((item) => <ProductItem key={item.id} {...item} />);
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>{products}</ul>
    </section>
  );
};

export default Products;
