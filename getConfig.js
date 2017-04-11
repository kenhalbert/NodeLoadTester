module.exports = (args) => {
  const targetThroughput = args.throughput;
  const numberOfConcurrentRequests = args.requestorCount || 10;
  const rampUpTimeInSeconds = args.rampUpTimeInSeconds || 0;
  const requestor = args.requestor || './requestors/example';

  // computed config
  const requestIntervalInSeconds = (60 * numberOfConcurrentRequests) / targetThroughput;
  const requestStartupIntervalInMilliseconds = (rampUpTimeInSeconds / numberOfConcurrentRequests) * 1000;

  return {
    requestor,
    targetThroughput,
    numberOfConcurrentRequests,
    requestIntervalInSeconds,
    requestStartupIntervalInMilliseconds,
    rampUpTimeInSeconds
  };
};