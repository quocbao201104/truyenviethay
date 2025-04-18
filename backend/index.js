const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config(); // Load biến môi trường từ file .env
const db = require("./config/db"); // Kết nối DB
const path = require("path"); // Đường dẫn tuyệt đối đến thư mục chứa file tĩnh

// Các middleware bảo mật và tối ưu
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const xssClean = require("xss-clean");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Middleware
app.use(cors()); // Cho phép tất cả các nguồn gốc truy cập API
app.use(helmet()); // Bảo mật HTTP headers
app.use(compression()); // Nén phản hồi để tiết kiệm băng thông
app.use(xssClean()); // Làm sạch dữ liệu đầu vào để ngăn chặn tấn công XSS
app.use(morgan("dev")); // Ghi log các yêu cầu đến server
app.use(express.json()); // Middleware để xử lý JSON

// Rate limit (example: 100 req per 15 mins)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter); // Giới hạn số lượng yêu cầu từ một IP trong khoảng thời gian nhất định

// Middleware để xử lý form-data nếu cần upload file
app.use(express.urlencoded({ extended: true }));
//  import các route
const authRoutes = require("./routes/auth.routes"); // Route auth
const storyRoutes = require("./routes/story.routes"); // Route truyện
const chapterRoutes = require("./routes/chapter.routes"); // Route chương
const uploadRoutes = require("./routes/up_story.routes"); // Route upload truyện
const fileRoutes = require("./routes/file.routes"); // Route upload file
const errorMiddleware = require("./middleware/errorHandler"); // Middleware xử lý lỗi
const theloaiRoutes = require("./routes/category.routes"); // Route thể loại
const historyRoutes = require("./routes/history.routes"); // Route lịch sử đọc truyện
const followRoutes = require("./routes/follow.routes"); // Route theo dõi truyện
const commentRoutes = require("./routes/comment.routes"); // Route bình luận
const likeRoutes = require("./routes/like.routes"); // Route like truyện
// Mount các route
app.use("/api/auth", authRoutes); // Route auth
app.use("/api/truyen", storyRoutes); // Route truyện
app.use("/api/chuong", chapterRoutes); // Route chươngSS
app.use("/api/upload-truyen", uploadRoutes); // Route upload truyện
app.use("/api/upload-files", fileRoutes); // Route upload file
app.use("/api/theloai", theloaiRoutes); // Route thể loại
app.use("/api/history", historyRoutes); // Route lịch sử đọc truyện
app.use("/api/comments", commentRoutes); // Route bình luận
app.use("/api/follow", followRoutes); // Route theo dõi truyện
app.use("/api/like", likeRoutes); // Route like truyện
// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
}); // Route test để kiểm tra server hoạt động

// Middleware xử lý 404
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Tuyến đường không tồn tại" });
}); // Nếu không tìm thấy route nào thì trả về 404

app.use(errorMiddleware); // Middleware xử lý lỗi toàn cục

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); // Kết nối DB và khởi động server
