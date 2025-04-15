const express = require("express");
const router = express.Router();
const { uploadStory } = require("../controllers/upload.controller"); // import uploadStory
const upload = require("../middleware/upload_story"); // dùng multer
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

router.post(
  "/cover",
  authenticateToken,
  authorizeRoles("admin", "author"), // chỉ admin và tác giả mới được phép
  upload.single("cover"), // Multer middleware để xử lý file upload
  uploadStory // sử dụng hàm uploadStory từ controller
);

module.exports = router;
