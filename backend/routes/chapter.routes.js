const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapter.controller");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Tác giả đăng chương mới
router.post(
  "/",
  authenticateToken,
  authorizeRoles("author", "admin"), // chỉ tác giả hoặc admin được thêm chương
  chapterController.createChapter
);

// Lấy danh sách chương theo truyện (có phân trang)
router.get("/truyen/:id", chapterController.getChaptersByStoryId);

// Lấy chi tiết 1 chương theo ID
router.get("/:id", chapterController.getChapterById);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  chapterController.updateChapter
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "author"),
  chapterController.deleteChapter
);

module.exports = router;
