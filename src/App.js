import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);  // State to store products
  const [page, setPage] = useState(1);  // State to store current page number
  const [loading, setLoading] = useState(false);  // State to track loading status
  const [hasMore, setHasMore] = useState(true);  // State to track if more products are available

  const fetchProducts = async () => {
    if (loading || !hasMore) return;  // Prevent fetching if already loading or no more products

    setLoading(true);  // Set loading to true before fetching
    try {
      const response = await axios.get(`https://summersalt.com/collections/swimwear/products.json?page=${page}&limit=10`);
      const newProducts = response.data.products;  // Get products from response
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);  // Append new products to existing products
      setHasMore(newProducts.length > 0);  // Check if there are more products to load
      setPage((prevPage) => prevPage + 1);  // Increment page number for next fetch
    } catch (error) {
      console.error('Error fetching products:', error);  // Log error if fetch fails
    }
    setLoading(false);  // Set loading to false after fetching
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && !loading) {
      fetchProducts();  // Fetch products if scrolled to bottom and not already loading
    }
  };

  useEffect(() => {
    fetchProducts();  // Fetch initial set of products on component mount
  });

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);  // Add scroll event listener
    return () => window.removeEventListener('scroll', handleScroll);  // Clean up event listener on component unmount
  },[]);

  return (
    <div className="App">
      <h1>Summersalt Swimwear Collection</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <a href={`https://summersalt.com/products/${product.handle}`} target="_blank" rel="noopener noreferrer">
              <h2>{product.title}</h2>
              <img src={product.images[0].src} alt={product.title} />
            </a>
          </div>
        ))}
      </div>
      {loading && <p>Loading more products...</p>}
      {!hasMore && <p>No more products to display</p>}
    </div>
  );
};

export default App;
