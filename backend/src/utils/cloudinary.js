import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
dotenv.config()
import fs from "fs"
import {upload} from "../middlewares/multer.middleware.js"


cloudinary.config({
cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_API_SECRET,
}) ;


const uploadonCloudinary=async(localFilePath, resourceType) =>{
    try{
        if(!localFilePath){
            console.log("No local file path provided");
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:resourceType,
        });
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(err){
        console.log("Cloudinary upload error:", err);
      
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

export {uploadonCloudinary};