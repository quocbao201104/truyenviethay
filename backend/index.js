const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const db = require("./config/db"); // Kết nối DB

const path = require("path");

// Middleware để xử lý JSON
app.use(express.json());
// Middleware để xử lý form-data nếu cần upload file
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth.routes");
const storyRoutes = require("./routes/story.routes");
const chapterRoutes = require("./routes/chapter.routes");
const uploadRoutes = require("./routes/upload.routes");
const fileRoutes = require("./routes/file.routes");

// Mount các route
app.use("/api/auth", authRoutes);
app.use("/api/truyen", storyRoutes);
app.use("/api/chuong", chapterRoutes);
app.use("/api/upload-truyen", uploadRoutes);
app.use("/api/upload-files", fileRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Tạo folder public để chứa ảnh bìa, v.v.
// Middleware xử lý 404
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Tuyến đường không tồn tại" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
