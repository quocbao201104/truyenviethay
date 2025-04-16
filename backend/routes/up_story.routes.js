const express = require("express");
const router = express.Router();
const { uploadStory } = require("../controllers/up_story.controller"); // import uploadStory
const upload = require("../middleware/upload_story"); // dùng multer
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { validateStory } = require("../validators/story.validator");

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "author"), // chỉ admin và tác giả mới được phép
  upload.single("image"), // Multer middleware để xử lý file upload
  validateStory,
  uploadStory
);

module.exports = router;
