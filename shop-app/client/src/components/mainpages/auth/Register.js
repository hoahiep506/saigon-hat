import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		rePassword: "",
	});

	const onChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const registerSubmit = async (e) => {
		e.preventDefault();
		if (user.password === user.rePassword) {
			try {
				await axios.post("/user/register", { ...user });

				localStorage.setItem("firstLogin", true);

				window.location.href = "/";
			} catch (err) {
				alert(err.response.data.msg);
			}
		} else {
			alert("Mật khẩu không khớp");
		}
	};

	return (
		<div className="login-page">
			<form onSubmit={registerSubmit}>
				<h2>Register</h2>
				<input
					type="text"
					name="name"
					required
					placeholder="Tên đăng nhập"
					value={user.name}
					onChange={onChangeInput}
				/>

				<input
					type="email"
					name="email"
					required
					placeholder="Email"
					value={user.email}
					onChange={onChangeInput}
				/>

				<input
					type="password"
					name="password"
					required
					autoComplete="on"
					placeholder="Mật khẩu"
					value={user.password}
					onChange={onChangeInput}
				/>
				<input
					type="password"
					name="rePassword"
					required
					autoComplete="on"
					placeholder="Nhập lại mật khẩu"
					value={user.rePassword}
					onChange={onChangeInput}
				/>

				<div className="row">
					<button type="submit">Đăng ký</button>
					<Link to="/login">Đăng nhập</Link>
				</div>
			</form>
		</div>
	);
}
