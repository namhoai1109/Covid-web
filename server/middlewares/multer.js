const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, png and jpg images are allowed"), false);
  }
}

// fieldName is the name of the field in the form
// options is the type of file upload: single, array
// if options is array, count 
const uploadFile = (fieldName, options, count) => {
  if (!fieldName && !options) {
    throw new Error("Missing required arguments");
  }
  if (options !== "single" && options !== "array") {
    throw new Error("Invalid options");
  }
  if (options === "array" && !count) {
    throw new Error("Missing count argument for array upload");
  }

  return (req, res, next) => {
    const upload = multer({ storage: storage, fileFilter: fileFilter })[options](fieldName, count);
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ message: err.message });
      } else if (err) {
        return res.status(400).send({ message: err.message });
      }
      next();
    })
  }
};

module.exports = { uploadFile };