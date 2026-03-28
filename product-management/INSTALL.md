# setup aws
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::<bucket-name>/*",
                "arn:aws:s3:::<bucket-name>"
            ]
        }
    ]
}
```

# Tạo folder dự án
```
mkdir <nvminh162-project-name>

cd <nvminh162-project-name>
```

# Khởi tạo dự án
```
npm init -y

npm install @aws-sdk/client-s3 @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb ejs express dotenv multer nodemon
```
```
"start": "nodemon index.js"
```