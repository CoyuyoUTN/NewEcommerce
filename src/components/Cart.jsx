import React, { useEffect } from "react";
import "../styles/Cart.css";
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2'
import { useCartContext } from "./CartProvider";
import '../styles/Item.css'
import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";


const Cart = () => {
  const {cart, deleteCart, setCart } = useCartContext()
  console.log('Producto desde componente Cart',cart);
 
  
  useEffect(() => {
    setCart(cart);
  }, [cart]);
  console.log('PRODUCTS', cart);
  /*   function configResult(price) {
    return Number.parseFloat(price).toFixed(2);
  } */

  function configResult(price) {
    const formatPeso = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARG",
      minimumFractionDigits: 0,
    });
    let valor = formatPeso.format(price);
    return valor;
  }
  
  const totalPay = () => {
    let result = 0;
    cart.map((product) => {
      result = result + (product.price * product.count);
    });
    return configResult(result);
  };
  const deleteOneProduct = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
          const filterList = cart.filter((item) => item.id != id)
          //console.log('filter list', filterList);
          setCart([...filterList])
          Swal.fire(
            'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        console.log('deteleOneProduct',cart);
      }
    })
  }
  const more = (id, count, stock) => {
    const productIndice = cart.findIndex((product) => product.id === id)
    
    let productToAddItem = cart[productIndice]
    //console.log('Product to add item', productToAddItem );
    if (count < stock){
      let newProductAmount = {...productToAddItem, count : productToAddItem.count +1}
      const newCart = [...cart]
      newCart.splice(productIndice, 1 , newProductAmount)
      //console.log('see new count in product', newProductAmount )
      console.log('NEWCART', newCart);
      setCart(newCart)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Sin Stock!',
    })
    }
  }
  const less = (id, count) => {
    const productIndice = cart.findIndex((product) => product.id === id)
    
    let productToDeleteItem = cart[productIndice]
    //console.log('Product to delete item', productToDeleteItem );
    if (count > 1){
      let newProductAmount = {...productToDeleteItem, count : productToDeleteItem.count -1}
      const newCart = [...cart]
      newCart.splice(productIndice, 1 , newProductAmount)
      //console.log('see new count in product', newProductAmount )
      console.log('NEWCART', newCart);
      setCart(newCart)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No se pueden descontar más productos.',
    })
    }
  }
  const deletAllList = ()=> {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
          deleteCart()
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
            )
          }
    })
  }
/*   const totalItemsPrice = cart.reduce((prevValue, currentValue)=> prevValue + (currentValue.count*10),0)
  console.log('total items price', totalItemsPrice); */
  return (
    <div className="cart__container">  {cart.length > 0 ?
      <div className="products__cart__container">
        {cart.map((item) => {
          return (
            <div className='item__container' key={item.id}>
              <div className="item__details__container">
                <div className='imageContainer'>
                  <img className='productImg' src={item.image}></img>
                </div>
                <div className="title__container">
                  <h4>{item.title}</h4>
                  <Link className="link__details" to={`/details/${item.id}`}>Detalles</Link>
                </div>
              </div>
              <div className="total__container">
                <div className="toggle__container" >
                  <h5>Cantidad</h5>
                  <div className="botton__toggle__container">
                    <Button variant="outline-primary" onClick={() => more(item.id, item.count, item.stock)}>+</Button>
                    <p>{`${item.count} de ${item.stock}`}  </p>
                    <Button variant="outline-primary" onClick={() => less(item.id, item.count)}>-</Button>
                  </div>
                </div>
                <div className="price__container">
                  <p>Precio: ${configResult(item.price)}</p>
                  <p>Total: ${configResult(item.count * item.price)}</p>
                </div>
                <Button variant="danger" className="button__delete__container" onClick={() => deleteOneProduct(item.id)}>Delete product</Button>
              </div>
            </div>
          )
        })}
        <div className="total__gral__container">
          <Button variant="danger" onClick={deletAllList}>Delet All List</Button>
          <h5>Total General ${totalPay()}</h5>
        </div>
          <button className="button__buy" variant="info">
            <Link className="link__details" to={"/checkout"}>
              Go to pay
            </Link>
          </button>
        </div>
        : 
        <div className="empty__cart">
          <Row><h1>Empty cart!</h1></Row>
          <Row className="cart__img"><img src="https://cdn-icons-png.flaticon.com/512/2331/2331970.png"/></Row>
        </div>}
    </div>
  )
};
export default Cart;