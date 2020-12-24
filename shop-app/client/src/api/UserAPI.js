import axios from "axios";
import { useEffect, useState } from "react";

export default function UserAPI(token) {
	const [isLogged, setIsLogged] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [cart, setCart] = useState([]);
	const [history, setHistory] = useState([]);

	useEffect(() => {
		if (token) {
			const getUser = async () => {
				try {
					const res = await axios.get("/user/info", {
						headers: { Authorization: token },
					});
					setIsLogged(true);
					res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
					setCart(res.data.cart);
				} catch (err) {
					alert(err.response.data.msg);
				}
			};
			getUser();
		}
	}, [token]);

	const addCart = async (product) => {
		if (!isLogged) {
			alert("Vui lòng đăng nhập để mua hàng");
			window.location.href = "/login";
		}
		const check = cart.every((item) => {
			return item._id !== product._id;
		});

		if (check) {
			setCart([...cart, { ...product, quantity: 1 }]);
			await axios.patch(
				"/user/add_cart",
				{ cart: [...cart, { ...product, quantity: 1 }] },
				{
					headers: { Authorization: token },
				}
			);
		} else {
			alert("Mặt hàng này đã có trong giỏ của bạn");
		}
	};

	return {
		isLogged: [isLogged, setIsLogged],
		isAdmin: [isAdmin, setIsAdmin],
		cart: [cart, setCart],
		addCart: addCart,
		history: [history, setHistory],
	};
}
