'use strict';

/**
 * Created by PHE on 2016/6/21.
 */
let aws = require('aws-sdk');

// AWS set region
if (process.env.SERVERLESS_REGION) {
  console.log("set region to", process.env.SERVERLESS_REGION);
  aws.config.update({
    region: process.env.SERVERLESS_REGION,
  });
} else {
  aws.config.update({
    region: 'ap-northeast-1',
  });
}
module.exports = aws;