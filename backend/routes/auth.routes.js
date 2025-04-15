const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const upload = require("../middleware/upload_avatar");
const { authenticateToken } = require("../middleware/auth");

router.post("/dang-ky", authController.register);
router.post("/dang-nhap", authController.login);
router.get("/me", authenticateToken, authController.getMe);

router.put(
  "/me",
  authenticateToken,
  upload.single("avatar"),
  authController.updateMe
);

module.exports = router;
