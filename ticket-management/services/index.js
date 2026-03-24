const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const { dynamodbClient, s3Client } = require('../config');

const TABLENAME = "EventTickets";
const BUCKETNAME = process.env.AWS_BUCKET_NAME;

const getAll = async () => {
    const params = { TableName: TABLENAME }
    const result = await dynamodbClient.send(new ScanCommand(params));
    return result.Items || [];
}

const getId = async (id) => {
    const params = { TableName: TABLENAME, Key: { ticketId: id } }
    const result = await dynamodbClient.send(new GetCommand(params));
    return result.Item || null;
}

const upsert = async (item) => {
    const params = { TableName: TABLENAME, Item: item }
    await dynamodbClient.send(new PutCommand(params));
    return item;
}

const remove = async (id) => {
    const params = { TableName: TABLENAME, Key: { ticketId: id } };
    await dynamodbClient.send(new DeleteCommand(params));
    return true;
}

const uploadImage = async (file) => {
    if (!file) return null;
    const key = `tickets/${uuidv4()}-${file.originalname}`;
    const params = {
        Bucket: BUCKETNAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    };
    await s3Client.send(new PutObjectCommand(params));
    return `https://${BUCKETNAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = { getAll, getId, upsert, remove, uploadImage }