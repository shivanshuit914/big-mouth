'use strict';

const fs = require("fs")

module.exports.handler = async event => {
  const html = await fs.readFileSync('static/index.html', 'utf-8');
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    },
    body: html,
  };
};
