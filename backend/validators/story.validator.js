const { body } = require("express-validator");
const { handleValidation } = require("../middleware/validate");

exports.validateStory = [
  body("title").notEmpty().withMessage("Tiêu đề truyện không được để trống"),
  body("author_name").notEmpty().withMessage("Tên tác giả không được để trống"),
  body("description")
    .notEmpty()
    .withMessage("Mô tả truyện không được để trống"),
  body("chuong_mau").notEmpty().withMessage("Chương mẫu không được để trống"),
  handleValidation,
];
