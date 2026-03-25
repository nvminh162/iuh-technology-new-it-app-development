require('dotenv').config();
const { ScanCommand, GetCommand, DeleteCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3") 

const { s3Client, dynamoDBClient } = require('../config');
const TableName = "Products";
const Bucket = "nguyenvanminh-22003405-s3-midterm";

const findAll = async () => {
    const data = await dynamoDBClient.send(new ScanCommand({ TableName }));
    return data.Items || [];
}

const findById = async (id) => {
    const data = await dynamoDBClient.send(new GetCommand({ TableName, Key: { id } }));
    return data.Item || null;
}

module.exports = { findAll, findById }
