const commandLineArgs = require('command-line-args');
const commandLineOptionDefs = require('./commandLineOptionDefinitions');
const getConfig = require('./getConfig');
const getRampUpFunction = require('./getRampUpFunction');
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
  startRequestingAtFullThroughput();
else {
  const rampUpFunc = getRampUpFunction({
    targetThroughput: config.targetThroughput,
    rampUpTimeInSeconds: config.rampUpTimeInSeconds,
    rampUpEquationDegree: config.rampUpEquationDegree
  });

  let requestCounter = 0,
    currentTargetThroughput = 0;

  const rampUpLogInterval = setInterval(() => {
    console.log(`rampup currently targeting ${currentTargetThroughput} requests per minute`);
  }, 10000);

  // TODO add a brief explanation of how this algorithm works here
  /* TODO instead of approximating the graph this way, I should try finding the area under
     the curve in the interval rampUpAdjustmentPeriodInMilliseconds to determine the number
     of requests that need to be made in that period, and then try to distribute them across
     the interval as evenly as possible if requestCounter > 1 */
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


