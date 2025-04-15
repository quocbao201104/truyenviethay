const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Đăng ký
exports.register = async (req, res) => {
  const {
    username,
    password,
    email,
    full_name,
    phone,
    role = "user",
    avatar,
  } = req.body;

  if (!username || !password || !email || !full_name || !phone) {
    return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      email,
      full_name,
      phone,
      role,
      avatar: avatar || "/uploads_img/avatar/default-avatar.jpg", // Gán avatar mặc định nếu không có
    };

    await User.create(newUser); // Tạo người dùng với avatar mặc định
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo user", error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await User.findByUsername(username);
    if (results.length === 0) {
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập", error: err.message });
  }
};

// Lấy thông tin người dùng
exports.getMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const results = await User.findById(userId);
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const user = results[0];
    res.json({
      message: "Thông tin người dùng",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin người dùng",
      error: err.message,
    });
  }
};

// [PUT] /api/users/me - Cập nhật thông tin người dùng
exports.updateMe = async (req, res) => {
  const userId = req.user.id;
  const { full_name, email, phone } = req.body;

  let avatarPath;
  if (req.file) {
    avatarPath = "/uploads_img/avatar/" + req.file.filename; // Lưu đường dẫn mới
  }

  try {
    const affected = await User.updateUser(userId, {
      full_name,
      email,
      phone,
      avatar: avatarPath, // avatar sẽ null nếu không có file upload
    });

    if (affected === 0) {
      return res
        .status(400)
        .json({ message: "Không có thông tin nào được cập nhật." });
    }

    res.json({ message: "Cập nhật thông tin thành công!" });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin",
      error: err.message,
    });
  }
};
