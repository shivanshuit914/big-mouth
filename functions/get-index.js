'use strict';

const fs = require("fs");
const Mustache = require("mustache");
const axios = require('axios');
const aws4 = require('aws4');
const URL = require('url');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const restaurantApiRoot = process.env.restaurant_api;
const awsRegion = process.env.AWS_REGION;
const cognitoUserPoolId = process.env.cognito_user_pool_id;
const cognitoClientId = process.env.cognito_client_id

const getRestaurants = async() => {
  let url = URL.parse(restaurantApiRoot);
  let opts = {
    host: url.host,
    path: url.pathname
  };

  aws4.sign(opts);

  const response = await axios.get(restaurantApiRoot, {
      headers: {
        'Host': opts.headers['Host'],
        'X-Amz-Date': opts.headers['X-Amz-Date'],
        'X-Amz-Security-Token': opts.headers['X-Amz-Security-Token'],
        'Authorization': opts.headers['Authorization']
      }
    });
  return response.data;
}

module.exports.handler = async (event, context) => {
  const template = await fs.readFileSync('static/index.html', 'utf-8');
  const restaurants = await getRestaurants();
  let dayOfWeek = days[new Date().getDay()];
  let view = {
    dayOfWeek, 
    restaurants,
    awsRegion,
    cognitoUserPoolId, //: context.cognito.user_pool_id,
    cognitoClientId, // : context.cognito.client_id,
    searchUrl: `${restaurantApiRoot}/search`,
    // placeOrderUrl: `${context.orders_api}`
  };
  let html = Mustache.render(template, view);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    },
    body: html,
  };
};
