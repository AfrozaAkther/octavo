import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeItemHandler = (item) => {
    ctxDispatch({
      type: 'CART_REMOVE_ITEM',
      payload: item,
    });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      
      <Helmet>
        
        <title>Shopping Cart</title>
      </Helmet>
      <div className="text-center pb-3">
      <h1 className='product-title'>Shopping Cart</h1>
      </div>
        <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart Is Empty <Link className='link-color' to="/"> <strong>Go Shopping</strong> </Link>
            </MessageBox>
          ) : (
            <ListGroup >
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img=fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link className= " product-title link-color" to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="danger"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span> &nbsp;{item.quantity}&nbsp;</span>{' '}
                      <Button
                        variant="success"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}> ${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="danger"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>{' '}
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3 className='text-center product-title'>
                    Subtotal </h3>
                 <h5>  {cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </h5> 
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      {' '}
                      Procced To Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
