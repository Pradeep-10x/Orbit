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
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
  
  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, QuickTime) are allowed"), false);
  }
};

const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB limit
};

export const upload = multer({storage, fileFilter, limits});