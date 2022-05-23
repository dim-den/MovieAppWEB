import { cloudinaryConfig } from '../config/cloudinaryConfig';
const cloudinary = require("cloudinary");


export class CloudinaryService {
    public constructor() {
        cloudinary.v2.config(cloudinaryConfig);
    }
  
    async UploadImage(file: any, folder: any) {
        return new Promise( resolve => {
            cloudinary.uploader.upload(file, (result: any) => {
                resolve({
                    url: result.url,
                    id: result.public_id
                })
            }, {
                resource_type: "auto",
                folder: folder
            });
        });
    }
}