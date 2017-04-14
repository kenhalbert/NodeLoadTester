const commandLineArgs = require('command-line-args');
const commandLineOptionDefs = require('./commandLineOptionDefinitions');
const getConfig = require('./getConfig');
const SimpleMovingAverage = require('./SimpleMovingAverage');
const RequestExecutor = require('./RequestExecutor');
const RequestStats = require('./RequestStats');

const args = commandLineArgs(commandLineOptionDefs);
const config = getConfig(args);

const requestor = require(config.requestor);

const requestTimeAverageInMilliseconds = SimpleMovingAverage({ datasetSize: 100 });

const requestStats = RequestStats(requestTimeAverageInMilliseconds);

const makeRequest = RequestExecutor({
  requestor,
  requestStats,
  requestTimeAverageInMilliseconds
});

console.log('Starting with config:  ', config);

setInterval(() => {
  console.log('average throughput for session (request/minute):', requestStats.requestsPerMinute);
}, 5000);

setInterval(() => {
  console.log('stats dump', JSON.stringify(requestStats));
}, 30000);

if (!config.rampUpTimeInSeconds)
  setInterval(makeRequest, config.requestIntervalInSeconds * 1000);
else {
  let intervalId = null

  const base = config.requestIntervalInSeconds * config.rampUpAdjustments; 
  const adjustmentPeriodInMilliseconds = (config.rampUpTimeInSeconds / config.rampUpAdjustments) * 1000;

  /*
    Thoughts on rampup approach:
      1.  Use recursive setTimeout calls with a gradually-decreasing interval until request throughput has been reached, then 
          transition to setInterval
            - May need to use calculus to get that to work - should be fun
      2.  Also consider adding support for rampup strategies so they can be configured & switched out
  */

  for (let i = 0; i < config.rampUpAdjustments; i++) {
    setTimeout(() => {
      if (intervalId) clearInterval(intervalId); 

      const newRequestInterval = (base - config.requestIntervalInSeconds * i) * 1000;
      const newThroughput = (60 / (newRequestInterval / 1000));

      console.log('raising target throughput to ' + newThroughput + ' per minute');

      intervalId = setInterval(makeRequest, newRequestInterval);
    }, adjustmentPeriodInMilliseconds * (i + 1));
  }

  setTimeout(() => {
    console.log('rampup complete!');
  }, adjustmentPeriodInMilliseconds * config.rampUpAdjustments);
}


