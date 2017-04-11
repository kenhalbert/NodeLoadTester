const factory = (requestTimeAverageInMilliseconds) => {
  const startTime = new Date();

  return {
    startTime,
    requestsStarted: 0,
    requestsFinished: 0,
    get responseTimeRollingAverageMilliseconds () {
      return requestTimeAverageInMilliseconds.getCurrentValue();
    },
    get runTime () {
      return new Date() - this.startTime;
    },
    get requestsInProgress () {
      return this.requestsStarted - this.requestsFinished;
    },
    get requestsPerMinute () {
      return this.requestsFinished / (this.runTime / 1000 / 60);
    }
  };
};

module.exports = factory;