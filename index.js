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

const startRequestingAtFullThroughput = () => setInterval(makeRequest, config.requestIntervalInSeconds * 1000);

if (!config.rampUpTimeInSeconds)
  startRequestingAtFullThroughput()
else {
  const rampUpFunc = (timeElapsedInSeconds) => {
    // given rampup time of 60 and target of 100 (for now, just for testign the core algo...)
    // y at x = 60 is 100
    // So one function that will work is y = (1 2/3)x
    return (1 + 2/3) * timeElapsedInSeconds;
  };

  let requestCounter = 0,
    currentTargetThroughput = 0;

  const rampUpLogInterval = setInterval(() => {
    console.log(`rampup currently targeting ${currentTargetThroughput} requests per minute`);
  }, 10000);

  const rampUpInterval = setInterval(() => {
    if (requestStats.runTime / 1000 >= config.rampUpTimeInSeconds) {
      console.log('ramped up!')

      clearInterval(rampUpInterval);
      clearInterval(rampUpLogInterval);

      startRequestingAtFullThroughput();
    }

    currentTargetThroughput = rampUpFunc(requestStats.runTime / 1000);
    const requestsThisPeriod = currentTargetThroughput * (config.rampUpAdjustmentPeriodInMilliseconds / (1000 * 60))
    requestCounter += requestsThisPeriod;

    while (requestCounter > 1) {
      makeRequest();
      requestCounter--;
    }
  }, config.rampUpAdjustmentPeriodInMilliseconds);
}


