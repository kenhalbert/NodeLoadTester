module.exports = (args) => {
  const targetThroughput = args.throughput;
  const rampUpTimeInSeconds = args.rampUpTimeInSeconds || 0;
  const requestor = args.requestor || './requestors/example';
  const rampUpAdjustmentPeriodInMilliseconds = args.rampUpAdjustmentPeriodInMilliseconds || 100;

  // computed config
  const requestIntervalInSeconds = 60 / targetThroughput;

  return {
    requestor,
    targetThroughput,
    requestIntervalInSeconds,
    rampUpTimeInSeconds,
    rampUpAdjustmentPeriodInMilliseconds
  };
};