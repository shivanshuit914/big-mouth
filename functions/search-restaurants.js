const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;

async function getRestaurantsByTheme(theme, count = 10) {
  let req = {
    TableName: process.env.restaurant_table,
    Limit: count,
    FilterExpression: "contains(themes, :theme)",
    ExpressionAttributeValues: {":theme": theme}
  };

  const resp = await dynamodb.scan(req).promise();
  return resp.Items;
}

module.exports.handler = async (event) => {
  try {
    const req = JSON.parse(event.body);
    let restaurants = await getRestaurantsByTheme(req.theme, defaultResults);

    return {
      statusCode: 200,
      body: JSON.stringify(restaurants)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    }
  }
}