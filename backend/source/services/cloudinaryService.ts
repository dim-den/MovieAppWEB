import { getCustomRepository } from 'typeorm';
import { cloudinaryConfig } from '../config/cloudinaryConfig';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { UserRepository } from '../repositories/userRepository';
import { AppError, HttpError } from '../util/errors';
const cloudinary = require("cloudinary");


export class CloudinaryService {
    private userRepository: UserRepository;
    public constructor() {
        cloudinary.v2.config(cloudinaryConfig);
        this.userRepository = getCustomRepository(UserRepository);
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