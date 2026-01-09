import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/allOrders`).then((res) => {
      setOrders(res.data);
    });
  }, []);

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <tr>
            <th>Type</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Price</th>
          </tr>
          {orders.map((order, index) => {
            return (
              <tr key={index}>
                <td><p>{order.mode}</p></td>
                <td>{order.name}</td>
                <td>{order.qty}</td>
                <td>{order.price.toFixed(2)}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Orders;
