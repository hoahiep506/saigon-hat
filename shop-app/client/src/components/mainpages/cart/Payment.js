import React, { useEffect, useState } from "react";
import { useId } from "react-id-generator";
import dataProvince from "./tinh_tp.json";
import dataDistrict from "./quan_huyen.json";
import dataWard from "./xa_phuong.json";

const initialState = {
	paymentID: "",
	phoneNumber: "",
	email: "",
	note: "",
	province: "",
	district: "",
	ward: "",
	street: "",
};

export default function Payment(props) {
	const [paymentID] = useId();
	const [infoPayment, setInfoPayment] = useState(initialState);
	const [districts, setDistricts] = useState([]);
	const [wards, setWard] = useState([]);

	const provinces = Object.values(dataProvince);
	const allDistricts = Object.values(dataDistrict);
	const allWards = Object.values(dataWard);

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setInfoPayment({ ...infoPayment, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const paymentData = {
			paymentID: paymentID,
			phoneNumber: infoPayment.phoneNumber,
			address: {
				province: infoPayment.province,
				district: infoPayment.district,
				ward: infoPayment.ward,
				street: infoPayment.street,
			},
			note: infoPayment.note,
		};

		props.tranSuccess(paymentData);
	};
	useEffect(() => {
		const idProvinces = provinces.find((province) => {
			return province.name_with_type === infoPayment.province;
		});

		const idDistricts = districts.find((district) => {
			return district.name_with_type === infoPayment.district;
		});
		if (idProvinces) {
			const districtOption = allDistricts.filter(
				(district) => district.parent_code === idProvinces.code
			);
			setDistricts(districtOption);
		}

		if (idDistricts) {
			const wardOption = allWards.filter(
				(ward) => ward.parent_code === idDistricts.code
			);
			setWard(wardOption);
		}
	}, [infoPayment.province, infoPayment.district]);

	return (
		<div className="payment">
			<h3>Thông tin đặt hàng</h3>
			<form onSubmit={handleSubmit}>
				<div className="row">
					<label htmlFor="phoneNumber">Số điện thoại</label>
					<input
						type="text"
						name="phoneNumber"
						id="phoneNumber"
						pattern="^[0-9]*$"
						title="Vui lòng nhập đúng số điện thoại"
						required
						value={infoPayment.phoneNumber}
						onChange={handleChangeInput}
					/>
				</div>

				<div className="row">
					<label htmlFor="province">Tỉnh/Thành phố: </label>
					<select
						name="province"
						value={infoPayment.province}
						onChange={handleChangeInput}
						required
					>
						<option value="temp">Chọn tỉnh thành</option>
						{provinces.map((province) => (
							<option value={province.name_with_type} key={province.code}>
								{province.name_with_type}
							</option>
						))}
					</select>
				</div>
				<div className="row">
					<label htmlFor="district">Quận/Huyện: </label>
					<select
						name="district"
						value={infoPayment.district}
						onChange={handleChangeInput}
						required
					>
						<option value="">Chọn quận huyện</option>
						{districts.map((district) => (
							<option value={district.name_with_type} key={district.code}>
								{district.name_with_type}
							</option>
						))}
					</select>
				</div>
				<div className="row">
					<label htmlFor="ward">Xã/Phường: </label>
					<select
						name="ward"
						value={infoPayment.ward}
						onChange={handleChangeInput}
						required
					>
						<option value="">Chọn phường xã</option>
						{wards.map((ward) => (
							<option value={ward.name_with_type} key={ward.code}>
								{ward.name_with_type}
							</option>
						))}
					</select>
				</div>
				<div className="row">
					<label htmlFor="street">Đường - Số nhà</label>
					<input
						type="text"
						name="street"
						id="street"
						required
						value={infoPayment.street}
						onChange={handleChangeInput}
						title="Vui lòng nhập đường và số nhà"
					/>
				</div>
				<div className="row">
					<label htmlFor="note">Ghi chú</label>
					<textarea
						type="text"
						name="note"
						id="note"
						value={infoPayment.note}
						onChange={handleChangeInput}
					/>
				</div>
				<h4>Tổng: ${props.total}</h4>

				<div className="btn-group-payment">
					<button type="submit">Đặt hàng</button>
					<button onClick={props.cancel}>Thoát</button>
				</div>
			</form>
		</div>
	);
}
