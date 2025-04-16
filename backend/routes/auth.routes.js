const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const upload = require("../middleware/upload_avatar");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  validateUpdateUser,
} = require("../validators/auth.validator");

router.post("/dang-ky", validateRegister, authController.register);
router.post("/dang-nhap", validateLogin, authController.login);
router.get("/me", authenticateToken, authController.getMe);

router.put(
  "/me",
  authenticateToken,
  upload.single("avatar"),
  validateUpdateUser,
  authController.updateMe
);

// Admin xóa user
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"), // Chỉ admin được quyền xóa
  authController.deleteUser
);

module.exports = router;
