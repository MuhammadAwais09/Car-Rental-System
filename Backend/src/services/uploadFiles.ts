
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import response from '../services/apiresponse';
import { errorHandler } from './handleResponse';
// import TrachModel from '../models/trash';

const uploadfile = async (req: any, res: any) => {
    try {

        var fileName: any;
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const publicDir = path.join("", 'public');
                const imagesDir = path.join(publicDir, 'uploads');

                if (!fs.existsSync(publicDir)) {
                    fs.mkdirSync(publicDir);
                }
                if (!fs.existsSync(imagesDir)) {
                    fs.mkdirSync(imagesDir);
                }

                cb(null, imagesDir);
            },
            filename: async (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                fileName = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();

                cb(null, fileName);
            },
        });
        const upload = multer({ storage }).single('file');

        upload(req, res, async (err: any) => {

            if (err) {
                console.log(err);
            }
            else {
                // const Trash = new TrachModel({
                //     fileName: fileName,
                // })
                // await Trash.save()
                return response.useSuccessResponse(res, "success", fileName, 200)
            }
        });
    }
    catch (err) {

        console.log(err);

        return errorHandler(res,err);
    }
}




// export async function deleteOldFiles(): Promise<void> {
//     try {
//         const fifteenDaysAgo = new Date();
//         fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

//         const oldFiles = await TrachModel.find({
//             updatedAt: { $lt: fifteenDaysAgo },
//         });

//         const deletedFiles: string[] = await deleteFiles(oldFiles.map((file) => file.fileName));

//         // Log or handle the result as needed
//         console.log(deletedFiles);
//     } catch (error) {
//         // Handle the error appropriately
//         console.error(error);
//     }
// }





// async function deleteFiles(filePaths: string[]): Promise<string[]> {
//     const results: string[] = [];

//     for (const filePath of filePaths) {
//         const fullFilePath = path.join('./public/uploads', filePath);
//         try {

//             try {
//                 // Wrap fs.access in a promise
//                 await new Promise<void>((resolve, reject) => {
//                     fs.access(fullFilePath, (err) => {
//                         if (err) reject(err);
//                         else resolve();
//                     });
//                 });

//                 await fs.unlink(fullFilePath, () => {

//                     results.push(`File deleted: ${fullFilePath}`);
//                 });
//             } catch (error) {
//                 results.push(`Error deleting ${filePath}: ${error.message}`);
//             }
//         } catch (error) {
//             results.push(`File not found: ${fullFilePath}`);
//         }
//     }

//     return results;
// }



export { uploadfile };


