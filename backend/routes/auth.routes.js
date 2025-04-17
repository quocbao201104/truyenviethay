const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const banUserUntil = require("../controllers/banUntil"); // import hàm ban user
const upload = require("../middleware/upload_img"); // dùng multer
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  validateUpdateUser,
} = require("../validators/auth.validator");

router.post("/dang-ky", validateRegister, authController.register);
router.post("/dang-nhap", validateLogin, authController.login);
router.get("/me", authenticateToken, authController.getMe);
router.get(
  "/search-nameusers",
  authenticateToken,
  authorizeRoles("admin"),
  authController.searchUsers
);

router.get(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"),
  authController.getUserById
);

router.put("change-password", authenticateToken, authController.changePassword);
router.get(
  "/all-users",
  authenticateToken,
  authorizeRoles("admin"),
  authController.getAllUsers
);

router.put(
  "/me",
  authenticateToken,
  upload.single("avatar"),
  validateUpdateUser,
  authController.updateMe
);

router.put(
  "/ban-user",
  authenticateToken,
  authorizeRoles("admin"),
  banUserUntil.banUser
);

// Admin xóa user
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"), // Chỉ admin được quyền xóa
  authController.deleteUser
);

module.exports = router;
