const StoryModel = require("../models/story.model");
const storyService = require("../services/story.sevices"); // Import service duyệt truyện

// Lấy danh sách tất cả truyện
const getAllStories = async (req, res) => {
  try {
    const stories = await StoryModel.getAll();
    res.status(200).json(stories);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách truyện" });
  }
};

// Lấy thông tin truyện theo ID
const getStoryById = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await StoryModel.getById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Không tìm thấy truyện" });
    }

    res.status(200).json(story);
  } catch (error) {
    console.error("Lỗi khi lấy truyện theo ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy truyện" });
  }
};

// Cập nhật thông tin truyện
const updateStory = async (req, res) => {
  const storyId = req.params.id;
  const { ten_truyen, tac_gia, mo_ta, trang_thai } = req.body; // Không cần lấy ảnh bìa nếu không có upload mới

  try {
    // Kiểm tra xem truyện có tồn tại không
    const existingStory = await StoryModel.getById(storyId);
    if (!existingStory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy truyện để cập nhật" });
    }

    // Phân quyền: admin hoặc tác giả chính chủ mới được quyền sửa truyện này
    const user = req.user;
    if (user.role !== "admin" && user.id !== existingStory.user_id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa truyện này" });
    }

    // Chuẩn bị dữ liệu cần cập nhật
    const updatedData = {
      ten_truyen,
      tac_gia,
      mo_ta,
      trang_thai,
      thoi_gian_cap_nhat: new Date(), // Tự động gán thời gian cập nhật
    };

    // Kiểm tra xem có ảnh bìa mới không
    if (req.file) {
      updatedData.anh_bia = "/uploads_img/bia_truyen/" + req.file.filename; // Cập nhật ảnh bìa mới nếu có
    }

    // Cập nhật truyện trong database
    const affectedRows = await StoryModel.update(storyId, updatedData);

    if (affectedRows > 0) {
      return res.status(200).json({ message: "Cập nhật truyện thành công" });
    } else {
      return res
        .status(400)
        .json({ message: "Không có thay đổi nào được lưu lại" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật truyện:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật truyện" });
  }
};

// Xóa truyện
const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    const existingStory = await StoryModel.getById(storyId);
    if (!existingStory) {
      return res.status(404).json({ message: "Không tìm thấy truyện để xoá" });
    }

    // Phân quyền: admin hoặc author chính chủ
    const user = req.user;
    if (user.role !== "admin" && user.id !== existingStory.user_id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xoá truyện này" });
    }

    const affectedRows = await StoryModel.delete(storyId);
    res.status(200).json({ message: "Xoá truyện thành công" });
  } catch (error) {
    console.error("Lỗi khi xoá truyện:", error);
    res.status(500).json({ message: "Lỗi khi xoá truyện" });
  }
};
// Lấy danh sách truyện chờ duyệt
const getPendingApproval = async (req, res) => {
  try {
    const stories = await StoryModel.getPendingApproval();
    res.status(200).json(stories);
  } catch (err) {
    console.error("Lỗi khi lấy truyện chờ duyệt:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy truyện chờ duyệt", error: err.message });
  }
};

// Duyệt hoặc từ chối truyện
const approveOrRejectStory = async (req, res) => {
  const { action } = req.body; // action có thể là 'duyet' hoặc 'tu_choi'
  const storyId = req.params.id;

  if (!action) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp hành động (duyet/tu_choi)." });
  }

  try {
    const result = await storyService.approveStory(storyId, action);
    res.json(result);
  } catch (error) {
    console.error("Error in approveOrRejectStory:", error);
    res.status(500).json({ message: "Có lỗi xảy ra!" });
  }
};

// Tác giả xem truyện của chính mình
const getMyStories = async (req, res) => {
  const userId = req.user.id; // Lấy userId từ JWT payload

  console.log("User ID:", userId); // Thêm log để kiểm tra giá trị của userId

  try {
    // Lấy truyện của tác giả từ model
    const stories = await StoryModel.getByAuthor(userId);

    // Kiểm tra nếu không có truyện nào
    if (!stories || stories.length === 0) {
      return res.status(200).json({ message: "Bạn chưa đăng truyện nào." });
    }

    // Trả về danh sách truyện của tác giả
    res.json(stories);
  } catch (err) {
    console.error("Lỗi khi lấy truyện cá nhân:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin lọc theo tác giả cụ thể
const getStoriesByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "User ID không hợp lệ" });
  }

  try {
    const stories = await StoryModel.getByAuthor(userId);
    if (!stories || stories.length === 0) {
      return res
        .status(200)
        .json({ message: "Người dùng này chưa đăng truyện nào." });
    }
    res.json(stories);
  } catch (err) {
    console.error("Lỗi khi lấy truyện theo user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  getPendingApproval,
  approveOrRejectStory,
  getStoriesByUserId,
  getMyStories,
};
