import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import randomColor from 'randomcolor';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="text-center pb-3">
        <h1 className="product-title">Featured Products</h1>
        <p>
          you can buy any product you want from it . all the essentials are in
          stock. just a click away
        </p>
      </div>
      <Helmet>
        <title className="product-title">octavo</title>
      </Helmet>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            <Col md={2} className="side-color">
              {' '}
              <h3 className="product-title">Categories </h3>
              {categories.map((category) => (
                <div>
                  <div key={category}>
                    <LinkContainer
                      to={{
                        pathname: '/search',
                        search: `?category=${category}`,
                      }}
                    >
                      <a href="/">{category}</a>
                    </LinkContainer>
                  </div>
                </div>
              ))}
            </Col>
            <Col md={10}>
              <Row>
                {products.map((product) => (
                  <Col key={product.slug} sm={12} md={4} className="mb-3">
                    <Product product={product} color={randomColor()}></Product>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
