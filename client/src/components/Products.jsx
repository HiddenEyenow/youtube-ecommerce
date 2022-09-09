import { useEffect, useState } from "react";
import styled from "styled-components";
import { popularProducts } from "../data";
import Product from "./Product";

//Install axios  in terminale con: npm install axios@0.24.0 e importalo
import axios from "axios";

const Container = styled.div`
padding: 20px;
display:flex;
flex-wrap:wrap;
justify-content: space-between;
`;

//Utilizziamo gli hooks per gestire i filtri
const Products = ({ cat, filters, sort }) => {
  // dichiaro i prodotti con un hook di stato iniziale
  const [products, setProducts] = useState([]);
  //dichiaro i prodotti filtrato con un hook di stato iniziale
  const [filteredProducts, setFilteredProducts] = useState([]);

  //Con useffect prenderemo i prodotti dal database
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          cat
            ? `http://localhost:5000/api/products?category=${cat}`
            : "http://localhost:5000/api/products"
        );
        setProducts(res.data);
      } catch (err) { }
    };
    getProducts();
  }, [cat]);

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [products, cat, filters]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
      {cat
        ? filteredProducts.map((item) => <Product item={item} key={item.id} />)
        : products
          .slice(0, 8)
          .map((item) => <Product item={item} key={item.id} />)}
    </Container>
  );
};

export default Products;
