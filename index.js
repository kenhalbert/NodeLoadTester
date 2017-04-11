const commandLineArgs = require('command-line-args');
const commandLineOptionDefs = require('./commandLineOptionDefinitions');
const getConfig = require('./getConfig');
const RampUpMonitor = require('./RampUpMonitor');
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

const rampUpMonitor = RampUpMonitor({
  numberOfConcurrentRequests: config.numberOfConcurrentRequests,
  onRampUpComplete: () => {
    console.log('ramped up!');
  },
  onNewRequestorStarted: () => {
    console.log('started new requestor');
  }
});

console.log('Starting with config:  ', config);

setInterval(() => {
  console.log('throughput (request/minute):', requestStats.requestsPerMinute);
}, 5000);

setInterval(() => {
  console.log('stats dump', JSON.stringify(requestStats));
}, 30000);

for (let i = 0; i < config.numberOfConcurrentRequests; i++)
{
  setTimeout(() => {
    setInterval(makeRequest, config.requestIntervalInSeconds * 1000);

    rampUpMonitor.requestorStarted();
  }, config.requestStartupIntervalInMilliseconds * i);
}
