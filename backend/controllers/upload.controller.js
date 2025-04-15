const StoryModel = require("../models/story.model");
const ChapterModel = require("../models/chapter.model");

const uploadStory = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Ảnh bìa là bắt buộc" });
    }

    const anh_bia = file.filename;
    const now = new Date();
    const user_id = req.user.id;

    // Tạo truyện mới với đầy đủ trường
    const storyId = await StoryModel.create({
      ten_truyen: data.title,
      tac_gia: data.author_name,
      mo_ta: data.description,
      trang_thai: data.trang_thai || "đang tiến hành",
      tinh_trang: data.tinh_trang || "chưa hoàn thành",
      trang_thai_viet: data.trang_thai_viet || "đang viết",
      yeu_to_nhay_cam: data.yeu_to_nhay_cam || 0,
      link_nguon: data.link_nguon || null,
      muc_tieu: data.muc_tieu || null,
      doi_tuong_doc_gia: data.doi_tuong_doc_gia || null,
      thoi_gian_cap_nhat: now,
      anh_bia,
      trang_thai_kiem_duyet: "cho_duyet",
      user_id,
      ghi_chu_admin: null,
      danh_gia_noi_dung: 0,
      danh_gia_van_phong: 0,
      danh_gia_sang_tao: 0,
    });

    // Tạo chương mẫu
    await ChapterModel.createSampleChapter({
      truyen_id: storyId,
      noi_dung: data.chuong_mau,
      thoi_gian_dang: now,
    });

    res.status(201).json({
      message: "Tạo truyện thành công, đang chờ duyệt",
      storyId,
    });
  } catch (err) {
    console.error("Lỗi khi upload truyện:", err);
    res.status(500).json({
      message: "Lỗi khi upload truyện",
      error: err.message,
    });
  }
};

module.exports = { uploadStory };
