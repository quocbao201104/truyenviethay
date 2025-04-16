// models/story.model.js
const db = require("../config/db");

const StoryModel = {
  // Tạo truyện mới
  create: async (storyData) => {
    const [result] = await db.query(
      `INSERT INTO truyen_new (
        ten_truyen, tac_gia, mo_ta, trang_thai, tinh_trang, trang_thai_viet,
        yeu_to_nhay_cam, link_nguon, muc_tieu, doi_tuong_doc_gia,
        thoi_gian_cap_nhat, anh_bia, trang_thai_kiem_duyet, user_id,
        ghi_chu_admin, danh_gia_noi_dung, danh_gia_van_phong, danh_gia_sang_tao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        storyData.ten_truyen,
        storyData.tac_gia,
        storyData.mo_ta,
        storyData.trang_thai,
        storyData.tinh_trang,
        storyData.trang_thai_viet,
        storyData.yeu_to_nhay_cam,
        storyData.link_nguon,
        storyData.muc_tieu,
        storyData.doi_tuong_doc_gia,
        storyData.thoi_gian_cap_nhat,
        storyData.anh_bia,
        storyData.trang_thai_kiem_duyet,
        storyData.user_id,
        storyData.ghi_chu_admin,
        storyData.danh_gia_noi_dung,
        storyData.danh_gia_van_phong,
        storyData.danh_gia_sang_tao,
      ]
    );
    return result.insertId;
  },

  // Lấy tất cả truyện (có thể thêm phân trang sau)
  getAll: async () => {
    const [rows] = await db.query(`SELECT * FROM truyen_new`);
    return rows;
  },

  // Lấy truyện theo ID
  getById: async (id) => {
    const [rows] = await db.query(`SELECT * FROM truyen_new WHERE id = ?`, [
      id,
    ]);
    return rows[0];
  },

  // Cập nhật truyện
  update: async (id, storyData) => {
    const [result] = await db.query(
      `UPDATE truyen_new SET 
        ten_truyen = ?, 
        tac_gia = ?, 
        mo_ta = ?, 
        trang_thai = ?, 
        anh_bia = ?, 
        thoi_gian_cap_nhat = NOW()
      WHERE id = ?`,
      [
        storyData.ten_truyen,
        storyData.tac_gia,
        storyData.mo_ta,
        storyData.trang_thai,
        storyData.anh_bia,
        id,
      ]
    );
    return result.affectedRows;
  },

  // Lấy danh sách truyện có trạng thái 'cho_duyet'
  getPendingApproval: async () => {
    const [rows] = await db.query(
      `SELECT * FROM truyen_new WHERE trang_thai_kiem_duyet = 'cho_duyet'`
    );
    return rows;
  },

  // Cập nhật trạng thái duyệt / từ chối và ghi chú admin
  updateApprovalStatus: async (id, status, adminNote) => {
    const [result] = await db.query(
      `UPDATE truyen_new SET trang_thai_kiem_duyet = ?, ghi_chu_admin = ? WHERE id = ?`,
      [status, adminNote, id]
    );
    return result.affectedRows;
  },

  // Lọc truyện của tác giả
  getByAuthor: async (userId) => {
    if (!userId || isNaN(userId)) {
      throw new Error("ID người dùng không hợp lệ");
    }
    const [rows] = await db.query(
      `SELECT * FROM truyen_new WHERE user_id = ?`,
      [userId]
    );
    return rows;
  },

  // Xóa truyện
  delete: async (id) => {
    const [result] = await db.query(`DELETE FROM truyen_new WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows;
  },
};

module.exports = StoryModel;
