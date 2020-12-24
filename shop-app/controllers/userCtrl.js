const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
	register: async (req, res) => {
		try {
			const { name, email, password } = req.body;

			const user = await Users.findOne({ email });
			if (user) return res.status(400).json({ msg: "Email đã tồn tại" });
			if (password.length < 9)
				return res.status(400).json({ msg: "Mật khẩu tối thiểu 9 ký tự" });

			// Password Encryption
			const passwordHash = await bcrypt.hash(password, 12);
			const newUser = new Users({
				name,
				email,
				password: passwordHash,
			});

			// Save on Database
			await newUser.save();

			// Create jsonwebtoken to authentication
			const accessToken = createAccessToken({ id: newUser._id });
			const refreshToken = createRefreshToken({ id: newUser._id });

			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				path: "/user/refresh_token",
			});

			res.json({ accessToken });
			res.json({ msg: "Đăng ký thành công" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await Users.findOne({ email });
			if (!user)
				return res.status(400).json({ msg: "Người dùng không tồn tại" });
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return res.status(400).json({ msg: "Mật khẩu người dùng không đúng" });

			// Create access token and refresh token when login success
			const accessToken = createAccessToken({ id: user._id });
			const refreshToken = createRefreshToken({ id: user._id });

			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				path: "/user/refresh_token",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			res.json({ accessToken });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	logout: async (req, res) => {
		try {
			res.clearCookie("Refresh Token", { path: "/user/refresh_token" });
			return res.json({ msg: "Đăng xuất thành công" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	refreshTokenFunc: (req, res) => {
		try {
			const rf_token = req.cookies.refreshToken;
			if (!rf_token)
				return res.status(400).json({ msg: "Vui lòng đăng nhập hoặc đăng ký" });

			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err)
					return res
						.status(400)
						.json({ msg: "Vui lòng đăng nhập hoặc đăng ký" });
				const accessToken = createAccessToken({ id: user.id });
				res.json({ user, accessToken });
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	getUser: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id).select("-password");
			if (!user)
				return res.status(400).json({ msg: "Người dùng không tồn tại" });
			res.json(user);
		} catch (err) {
			return res.status(500).json({ msg: message });
		}
	},

	addCart: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id);
			if (!user)
				return res.status(400).json({ msg: "Người dùng không tồn tại" });
			await Users.findOneAndUpdate(
				{ _id: req.user.id },
				{
					cart: req.body.cart,
				}
			);

			return res.json({ msg: "Đã thêm vào giỏ hàng" });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	history: async (req, res) => {
		try {
			const history = await Payments.find({ user_id: req.user.id });

			res.json(history);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
};

const createAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const createRefreshToken = (user) => {
	return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
