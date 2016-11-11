'use strict';

// User model
let aws = require('../config/aws');
let user = require('../user/user')(aws);

// Config
let slsAuth = require('serverless-authentication');
let config = slsAuth.config;
let utils = slsAuth.utils;
const crypto = require('crypto');
// Providers
let facebook = require('serverless-authentication-facebook');

// Callback switch
function callback(event, _callback) {
  let providerConfig = config(event);

  const decryption = (state) => {
    const decipher = crypto.createDecipher('aes256', process.env.TOKEN_SECRET);
    let decryptedState;
    try {
      decryptedState = decipher.update(state, 'hex', 'utf8');
      decryptedState += decipher.final('utf8');
      decryptedState = decryptedState.split('/')[0];
      return decryptedState;
    } catch (ex) {
      console.error(`Decryption Failed: ${ex}`);
      decryptedState = 'State mismatch';
      return decryptedState;
    }
  };

  let handleResponse = (err, profile, state) => {
    if (err) {
      utils.errorResponse({
        error: 'Unauthorized'
      }, providerConfig, _callback);
    } else {
      const decryptionState = decryption(state);
      if (decryptionState !== 'state-' + profile.provider) {
        // here you should compare if the state returned from provider exist in dynamo db
        // and then expire it
        utils.errorResponse({
          error: 'State mismatch'
        }, providerConfig, _callback);
      } else {
        const hmac = crypto.createHmac('sha256', process.env.TOKEN_SECRET);
        let id = profile.provider + '-' + hmac.update(profile.id).digest('hex');
        let tokenData = {
          payload: {
            id: id,
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
            userid: profile.id
          },
          options: {
            expiresIn: '1h'   // By rauchg/ms.js
          }
        };

        // here can be checked if user exist in db and update properties or if not, create new etc.
        user.getOneUser({
          accountid: id,
        }).then(() => {
          // update properties if needed
          utils.tokenResponse(tokenData, providerConfig, _callback);
        }).catch(err => {
          if (err.message.match(/404 Not Found:/gi)) {
            user.countUser({}).then(response => {
              return {
                accountid: id,
                username: profile.name,
                email: profile.email,
                role: response.Count === 0 ? "Admin" : "User", // First user set role to Admin
              };
            }).then(user.addOneUser).then(() => {
              utils.tokenResponse(tokenData, providerConfig, _callback);
            }).catch(err => {
              utils.errorResponse({
                error: err,
              }, providerConfig, _callback);
            });
          } else {
            utils.errorResponse({
              error: err,
            }, providerConfig, _callback);
          }
        });
      }
    }
  };

  switch (event.provider) {
    case 'facebook':
      facebook.callback(event, providerConfig, handleResponse);
      break;

    default:
      utils.errorResponse({
        error: 'Invalid provider'
      }, providerConfig, _callback);
  }
}

exports = module.exports = {
  callback,
};