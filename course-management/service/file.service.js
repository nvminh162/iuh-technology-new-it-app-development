require('dotenv').config();

const { s3 } = require('../utils/aws-helper');

// Hàm randomString sẽ tạo ra một chuỗi ngẫu nhiên với độ dài numberCharacter ký tự dùng để tạo tên file
const randomString = (numberCharacter) => {
    return `${Math.random()
        .toString(36)
        .substring(2, numberCharacter + 2)}`;
};

// Mảng FILE_TYPE_MATCH chứa các loại file được phép upload lên AWS S3 (image, video, pdf, word, powerpoint, rar, zip)
const FILE_TYPE_MATCH = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'video/mp3',
    'video/mp4',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/zip',
];

const filePath = `${randomString(4)}-${new Date().getTime()}-${file?.originalname}`; // Tạo tên file mới

const uploadFile = async (file) => {
    // Kiểm tra loại file có phù hợp với FILE_TYPE_MATCH hay không, nếu file.metaType không nằm trong FILE_TYPE_MATCH thì throw error
    if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1) {
        throw new Error(`${file?.originalname} is invalid!`);
    }

    // Tạo object params chứa thông tin của file cần upload
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Tên của bucket đã tạo trong AWS S3
        Body: file?.buffer, // Dữ liệu của file dưới dạng buffer
        Key: filePath, // Tên file mới
        ContentType: file?.mimetype, // Loại file
    };

    try {
        const data = await s3.upload(params).promise(); // Thực hiện upload file lên AWS S3 bằng method upload
        const fileName = `${process.env.AWS_CLOUDFRONT_URL}/${data.Key}`; // Trả về thông tin của file đã upload link file từ CloudFront URL
        console.log(`File uploaded successfully. ${data.Location}`);
        return fileName;
    } catch (err) {
        console.error('Error uploading file to AWS S3:', err);
        throw new Error('Upload file to AWS S3 failed');
    }
};

module.exports = { uploadFile };
