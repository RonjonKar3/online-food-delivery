import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", street: "", city: "",
    state: "", zipcode: "", country: "", phone: "", paymentMethod: "cod"
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (subtotal === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderItems = Object.entries(cartItems)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = food_list.find(food => food._id === id);
        return { name: item.name, price: item.price, quantity: qty };
      });

    const orderData = {
      address: data,
      items: orderItems,
      amount: total,
      paymentMethod: "cod",
    };

    try {
      const res = await fetch(`${url}/api/order/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.success) {
        navigate("/myorders");
      } else {
        alert("Order placement failed: " + (result.message || "Unknown error."));
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("An error occurred while placing the order.");
    }
  };

  return (
    <form className="place-order" onSubmit={submitHandler}>
      <div className="place-order-container">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="First name" required />
            <input name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Last name" required />
          </div>
          <input name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Email address" required />
          <input name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Street" required />
          <div className="multi-fields">
            <input name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder="City" required />
            <input name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="State" required />
          </div>
          <div className="multi-fields">
            <input name="zipcode" value={data.zipcode} onChange={onChangeHandler} type="text" placeholder="Zip code" required />
            <input name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Country" required />
          </div>
          <input name="phone" value={data.phone} onChange={onChangeHandler} type="tel" placeholder="Phone" required />

          <p className="title">Payment Method</p>
          <select name="paymentMethod" value={data.paymentMethod} disabled>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div className="cart-totals-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-totals-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-totals-details">
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>
            <button type="submit">Place Order</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
