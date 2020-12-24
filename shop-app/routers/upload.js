const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");

// config for upload img on cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

//Only admin can use
router.post("/upload", auth, authAdmin, (req, res) => {
	try {
		if (!req.files || Object.keys(req.files).length === 0)
			return res.status(400).json({ msg: "Không có file upload" });

		const file = req.files.file;

		if (file.size > 1024 * 1024) {
			removeTmp(file.tempFilePath);
			return res.status(400).json({ msg: "File quá lớn" });
		}

		if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
			removeTmp(file.tempFilePath);
			return res.status(400).json({ msg: "Định dạng sai, chỉ PNG và IMG" });
		}

		cloudinary.v2.uploader.upload(
			file.tempFilePath,
			{ folder: "saigon-hat" },
			async (err, result) => {
				if (err) throw err;
				removeTmp(file.tempFilePath);
				res.json({ public_id: result.public_id, url: result.secure_url });
			}
		);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
});

router.post("/destroy", auth, authAdmin, (req, res) => {
	try {
		const { public_id } = req.body;
		if (!public_id) return res.status(400).json({ msg: "Vui lòng chọn ảnh" });

		cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
			if (err) throw err;

			res.json({ msg: "Đã xóa ảnh" });
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
});

const removeTmp = (path) => {
	fs.unlink(path, (err) => {
		if (err) throw err;
	});
};

module.exports = router;
