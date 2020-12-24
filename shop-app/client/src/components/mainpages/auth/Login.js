import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});

	const onChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const loginSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/user/login", { ...user });
			localStorage.setItem("firstLogin", true);
			window.location.href = "/";
		} catch (err) {
			alert(err.response.data.msg);
		}
	};
	return (
		<div className="login-page">
			<form onSubmit={loginSubmit}>
				<input
					type="email"
					name="email"
					required
					placeholder="Nhập email"
					value={user.email}
					onChange={onChangeInput}
				/>
				<input
					type="password"
					name="password"
					required
					placeholder="Nhập mật khẩu"
					value={user.password}
					onChange={onChangeInput}
				/>

				<div className="row">
					<button type="submit">Đăng nhập</button>
					<Link to="register">Đăng ký</Link>
				</div>
			</form>
		</div>
	);
}
