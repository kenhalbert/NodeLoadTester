const request = require('superagent');

module.exports = () => {

  // do anything you need to here - just make sure to return an ES6 promise

  return new Promise((resolve, reject) => {
    const url = 'www.google.com';

    request
      .get(url)
      .end((err, res) => {
        if (err) 
          reject(err);
        else 
          resolve(res);
      });
  });
};