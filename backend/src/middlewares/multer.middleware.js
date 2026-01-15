import multer from 'multer';

const storage = multer.diskStorage(
    {
        destination: (req,file,callback) => {
            callback(null,'./src/public/temp');
        },
        filename: (req,file,callback) => {
            callback(null,Date.now()+ '-'+file.originalname);
        },
    }
);

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const limits = {
  fileSize: 50 * 1024 * 1024,
};

export const upload = multer({storage, fileFilter, limits});