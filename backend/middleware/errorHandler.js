module.exports = (err, req, res, next) => {
  console.error("Error caught:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi server!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
