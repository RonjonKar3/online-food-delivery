import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch user orders");
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className='order-container'>
      <div className='order-content'>
        <h3 className='order-title'>Orders List</h3>

        {orders.length === 0 ? (
          <p className='no-orders'>No orders found.</p>
        ) : (
          <div className="order-list">
            {orders.map((order, index) => (
              <div key={index} className='order-item'>
                <img src={assets.parcel_icon} alt="parcel" className='order-icon' />
                <div className='order-details'>
                  <p className='order-food'>
                    {order.items.map((item, index) => (
                      item.name + " x " + item.quantity + (index !== order.items.length - 1 ? ", " : "")
                    ))}
                  </p>
                  <p className="order-name">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <div className="order-address">
                    <p>{order.address.street}</p>
                    <p>{order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                  </div>
                  <p className='order-phone'>{order.address.phone}</p>
                </div>

                <div className='order-summary'>
                  <p>Items: {order.items.length}</p>
                  <p>Total: ${order.amount}</p>
                  <p>Status: {order.status}</p>
                  <p>Payment: {order.paymentStatus}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
