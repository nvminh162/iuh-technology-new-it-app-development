const {
  ScanCommand,
  GetCommand,
  DeleteCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");

const { s3Client, dynamoDBClient } = require("../config");
const TableName = "Products";
const Bucket = "nguyenvanminh-22003405-s3-midterm";

const findAll = async () => {
  const items = await dynamoDBClient.send(new ScanCommand({ TableName }));
  return items.Items || [];
};

const findById = async (id) => {
  const item = await dynamoDBClient.send(
    new GetCommand({ TableName, Key: { id } }),
  );
  return item.Item || null;
};

const add = async (body, file) => {
  const { name, customer, price, quantity, expiry, category } = body;
  const item = {
    id: randomUUID(),
    name,
    customer,
    price,
    quantity,
    expiry,
    category,
  };
  if (file) {
    const Key = `${randomUUID()}-${file.originalname}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    item.image = `https://${Bucket}.s3.amazonaws.com/${Key}`;
  }
  await dynamoDBClient.send(new PutCommand({ TableName, Item: item }));
};

const deleteById = async (id) => {
  const res = await findById(id);
  if (!res) throw new Error("Item not found");
  // remove image s3
  if (res.image) {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket, Key: res.image.split("/").pop() }),
    );
  }
  await dynamoDBClient.send(new DeleteCommand({ TableName, Key: { id } }));
};

module.exports = { findAll, findById, add, deleteById };
