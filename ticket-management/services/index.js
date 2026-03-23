const { ScanCommand, GetCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
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
    await dynamodbClient(params);
}

module.exports = { getAll, getId }