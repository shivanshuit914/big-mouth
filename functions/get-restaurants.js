const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;

async function getRestaurants() {
  let req = {
    TableName: process.env.restaurant_table,
    Limit: count
  };

  const resp = await dynamodb.scan(req).promise();
  return resp.Items;
}

module.exports.handler = async () => {
  let restaurants = await getRestaurants();

  return {
    statusCode: 200,
    body: JSON.stringify(restaurants)
  }
}