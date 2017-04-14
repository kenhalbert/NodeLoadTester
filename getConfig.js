module.exports = (args) => {
  const targetThroughput = args.throughput;
  const rampUpTimeInSeconds = args.rampUpTimeInSeconds || 0;
  const requestor = args.requestor || './requestors/example';
  const rampUpAdjustments = args.rampUpAdjustments;  // TODO find a way to compute an effective default for this value.

  // computed config
  const requestIntervalInSeconds = 60 / targetThroughput;

  return {
    requestor,
    targetThroughput,
    requestIntervalInSeconds,
    rampUpTimeInSeconds,
    rampUpAdjustments
  };
};