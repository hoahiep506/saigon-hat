import React, { useState, useContext } from "react";
import { GlobalState } from "../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
import iconMenu from "./icon/menu.svg";
import iconClose from "./icon/close.svg";
import iconCart from "./icon/cart.svg";

export default function Header() {
	const state = useContext(GlobalState);
	const [isLogged] = state.userAPI.isLogged;
	const [isAdmin] = state.userAPI.isAdmin;
	const [cart] = state.userAPI.cart;
	const [menu, setMenu] = useState(false);

	const logoutUser = async () => {
		await axios.get("/user/logout");
		localStorage.removeItem("firstLogin");
		window.location.href = "/";
	};

	const adminRouter = () => {
		return (
			<>
				<li>
					<Link onClick={() => setMenu(false)} to="/create_product">
						Tạo sản phẩm
					</Link>
				</li>
				<li>
					<Link onClick={() => setMenu(false)} to="/category">
						Danh mục
					</Link>
				</li>
			</>
		);
	};

	const loggedRouter = () => {
		return (
			<>
				<li>
					<Link onClick={() => setMenu(false)} to="/history">
						Lịch sử
					</Link>
				</li>
				<li>
					<Link to="/" onClick={(logoutUser, () => setMenu(false))}>
						Đăng xuất
					</Link>
				</li>
			</>
		);
	};
	const styleMenu = {
		left: menu ? 0 : "-100%",
	};
	return (
		<header>
			<div className="menu resp" onClick={() => setMenu(!menu)}>
				<img src={iconMenu} alt="icon-menu" />
			</div>

			<div className="logo">
				<h1>
					<Link to="/">{isAdmin ? "Admin" : "Saigon-Hat"}</Link>
				</h1>
			</div>

			<ul style={styleMenu} onClick={() => setMenu(false)}>
				<li>
					<Link onClick={() => setMenu(false)} to="/">
						{isAdmin ? "Sản phẩm" : "Shop"}
					</Link>
				</li>
				{isAdmin && adminRouter()}
				{isLogged ? (
					loggedRouter()
				) : (
					<li>
						<Link onClick={() => setMenu(false)} to="/login">
							Đăng nhập ✥ Đăng ký
						</Link>
					</li>
				)}

				<li onClick={() => setMenu(!menu)}>
					<img src={iconClose} alt="icon-menu" className="menu resp" />
				</li>
			</ul>
			{isAdmin ? (
				""
			) : (
				<div className="cart-icon">
					<span>{cart.length}</span>
					<Link to="/cart">
						<img src={iconCart} alt="icon-cart" />
					</Link>
				</div>
			)}
		</header>
	);
}
