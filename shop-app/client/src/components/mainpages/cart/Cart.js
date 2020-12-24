import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import Payment from "./Payment";

export default function Cart() {
	const state = useContext(GlobalState);
	const [cart, setCart] = state.userAPI.cart;
	const [token] = state.token;
	const [total, setTotal] = useState(0);
	const [payment, setPayment] = useState(false);

	useEffect(() => {
		const getTotal = () => {
			const total = cart.reduce((prev, item) => {
				return prev + item.price * item.quantity;
			}, 0);

			setTotal(total);
		};

		getTotal();
	}, [cart]);

	const addToCart = async (cart) => {
		await axios.patch(
			"/user/add_cart",
			{ cart },
			{
				headers: { Authorization: token },
			}
		);
	};
	const increment = (id) => {
		cart.forEach((item) => {
			if (item._id === id) {
				item.quantity += 1;
			}
		});

		setCart([...cart]);
		addToCart(cart);
	};

	const decrement = (id) => {
		cart.forEach((item) => {
			if (item._id === id) {
				item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
			}
		});

		setCart([...cart]);
		addToCart(cart);
	};
	const removeProduct = (id) => {
		if (window.confirm("Các hạ chắc chứ ?")) {
			cart.forEach((item, index) => {
				if (item._id === id) {
					cart.splice(index, 1);
				}
			});

			setCart([...cart]);
			addToCart(cart);
		}
	};

	const tranSuccess = async (payment) => {
		const { paymentID, address, phoneNumber, note } = payment;
		await console.log(cart, paymentID, address, phoneNumber, note);
		await axios.post(
			"/api/payment",
			{ cart, paymentID, address, phoneNumber, note },
			{
				headers: { Authorization: token },
			}
		);

		setCart([]);
		addToCart([]);
		alert("Đặt hàng thành công");
	};

	if (cart.length === 0)
		return (
			<h2 style={{ textAlign: "center", fontSize: "5rem" }}>Giỏ hàng trống</h2>
		);
	return (
		<div>
			{cart.map((product) => (
				<div className="cart" key={product._id}>
					<img src={product.images.url} alt="" />

					<div className="box-detail-cart">
						<h2>{product.title}</h2>
						<h3>$ {product.price * product.quantity}</h3>

						<div className="content-detail">
							<p>{product.description}</p>
						</div>

						<div className="amount">
							<button onClick={() => decrement(product._id)}> - </button>
							<span>{product.quantity}</span>
							<button onClick={() => increment(product._id)}> + </button>
						</div>
						<div className="delete" onClick={() => removeProduct(product._id)}>
							<span>X</span>
						</div>
					</div>
				</div>
			))}

			<div className="total">
				<h3>Tổng tiền: $ {total}</h3>
				<button onClick={() => setPayment(true)}>Thanh toán</button>
			</div>
			{payment ? (
				<Payment
					total={total}
					tranSuccess={tranSuccess}
					cancel={() => setPayment(false)}
				/>
			) : (
				""
			)}
		</div>
	);
}
