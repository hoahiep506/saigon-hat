import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";

export default function OrderHistory() {
	const state = useContext(GlobalState);
	const [history, setHistory] = state.userAPI.history;
	const [isAdmin] = state.userAPI.isAdmin;
	const [token] = state.token;

	useEffect(() => {
		if (token) {
			const getHistory = async () => {
				if (isAdmin) {
					const res = await axios.get("/api/payment", {
						headers: { Authorization: token },
					});
					setHistory(res.data);
				} else {
					const res = await axios.get("/user/history", {
						headers: { Authorization: token },
					});
					setHistory(res.data);
				}
			};
			getHistory();
		}
	}, [token, isAdmin, setHistory]);

	return (
		<div className="history-page">
			<h2>Lịch sử đặt hàng</h2>

			<h4>Bạn có {history.length} đơn hàng</h4>

			<table>
				<thead>
					<tr>
						<th>Mã vận đơn</th>
						<th>Ngày mua hàng</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{history.map((items) => (
						<tr key={items._id}>
							<td>{items.paymentID}</td>
							<td>{new Date(items.createdAt).toLocaleDateString()}</td>
							<td>
								<Link to={`/history/${items._id}`}>Xem</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
