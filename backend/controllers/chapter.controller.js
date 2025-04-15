const ChapterModel = require("../models/chapter.model");

// [POST] /api/chapters - Tác giả thêm chương mới (chờ duyệt)
const createChapter = async (req, res) => {
  try {
    const { truyen_id, so_chuong, tieu_de, noi_dung } = req.body;

    if (!truyen_id || !so_chuong || !tieu_de || !noi_dung) {
      return res.status(400).json({ message: "Thiếu thông tin chương!" });
    }

    const result = await ChapterModel.createChapter({
      truyen_id,
      so_chuong,
      tieu_de,
      noi_dung,
    });

    res.status(201).json({
      message: "Đã gửi chương chờ duyệt!",
      chapter_id: result.chapter_id,
    });
  } catch (error) {
    console.error("createChapter error:", error);
    res.status(500).json({ message: "Lỗi server khi tạo chương." });
  }
};
// laay danh sach chuong theo id truyen có phân trang , 20 chuong/1 trang
const getChaptersByStoryId = async (req, res) => {
  try {
    const truyen_id = parseInt(req.params.id); // đảm bảo là số
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    if (!truyen_id) {
      return res.status(400).json({ message: "Thiếu ID truyện!" });
    }

    const chapters = await ChapterModel.getChaptersByStoryId(
      truyen_id,
      limit,
      offset
    );
    res.json({ chapters });
  } catch (error) {
    console.error("getChaptersByStoryId error:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách chương." });
  }
};

// [GET] /api/truyen/:id - Lấy chi tiết chương
const getChapterById = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await ChapterModel.getChapterById(id);

    if (!chapter) {
      return res.status(404).json({ message: "Không tìm thấy chương!" });
    }

    res.json(chapter);
  } catch (error) {
    console.error("getChapterById error:", error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết chương." });
  }
};

// [PUT] /api/chuong/:id - Cập nhật chương
const updateChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const { tieu_de, noi_dung, so_chuong } = req.body;

    if (!tieu_de || !noi_dung || !so_chuong) {
      return res.status(400).json({ message: "Thiếu thông tin cập nhật!" });
    }

    const affected = await ChapterModel.updateChapter(chapterId, {
      tieu_de,
      noi_dung,
      so_chuong,
    });

    if (affected === 0) {
      return res.status(404).json({ message: "Không tìm thấy chương!" });
    }

    res.json({ message: "Cập nhật chương thành công!" });
  } catch (error) {
    console.error("updateChapter error:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật chương." });
  }
};

// [DELETE] /api/chuong/:id - Xóa chương
const deleteChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;

    const affected = await ChapterModel.deleteChapter(chapterId);

    if (affected === 0) {
      return res.status(404).json({ message: "Không tìm thấy chương!" });
    }

    res.json({ message: "Xóa chương thành công!" });
  } catch (error) {
    console.error("deleteChapter error:", error);
    res.status(500).json({ message: "Lỗi server khi xóa chương." });
  }
};

module.exports = {
  createChapter,
  getChaptersByStoryId,
  getChapterById,
  updateChapter,
  deleteChapter,
};
