// multerMiddleware.js

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  }
});

module.exports = { upload };
