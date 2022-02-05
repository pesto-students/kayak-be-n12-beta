import { FileOptions } from '@/interfaces/files.interface';
import { v2 as cloudinary } from 'cloudinary';

class CloudinaryService {
  public __init = () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  };

  public uploadFile = (file: any, options: FileOptions) => {
    this.__init();
    return new Promise((resolve, reject) => {
      const { destination, width, height, fileName } = options;
      try {
        cloudinary.uploader.upload(file, { public_id: fileName, folder: destination, width, height }, (err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(res);
        });
      } catch (error) {
        console.log(error);
      }
    });
  };
}

export default CloudinaryService;
