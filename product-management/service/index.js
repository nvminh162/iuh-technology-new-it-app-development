const { ScanCommand, GetCommand, DeleteCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3") 
const { randomUUID } = require('crypto');

const { s3Client, dynamoDBClient } = require('../config');
const TableName = "Products";
const Bucket = "nguyenvanminh-22003405-s3-midterm";

const findAll = async () => {
    const items = await dynamoDBClient.send(new ScanCommand({ TableName }));
    return items.Items || [];
}

const findById = async (id) => {
    const item = await dynamoDBClient.send(new GetCommand({ TableName, Key: { id } }));
    return item.Item || null;
}

const save = async (id, body, file) => {
    const { name, price, quantity } = body; // trừ image
    // payload create
    let item = { id: id ?? randomUUID(), name, price, quantity } // trừ image
    // payload update
    if (id) {
        const res = await findById(id);
        if (!res) throw new Error("Item not found");
        item = { ...res, name, price, quantity }; // đã rải url ảnh cũ vào
    }
    // payload s3
    if (file) {
        // upload file
        console.log(file.originalname);
        const Key = `${randomUUID()}-${file.originalname}`
        await s3Client.send(
            new PutObjectCommand({ Bucket, Key, Body: file.buffer, ContentType: file.mimetype })
        )
        // remove file cũ
        if (item.image) {
            await s3Client.send(
                new DeleteObjectCommand({ Bucket, Key: item.image.split('/').pop() })
            )
        }
        // update new image
        item.image = `https://${Bucket}.s3.amazonaws.com/${Key}`;
    }
    // upsert data
    await dynamoDBClient.send(
        new PutCommand({ TableName, Item: item })
    )
}

const deleteById = async (id) => {
    const res = await findById(id);
    if (!res) throw new Error("Item not found");
    // remove image s3
    if (res.image) {
        await s3Client.send(
            new DeleteObjectCommand({ Bucket, Key: res.image.split("/").pop() })
        )
    }
    await dynamoDBClient.send(new DeleteCommand({ TableName, Key: { id } }))
}

module.exports = { findAll, findById, save, deleteById }
