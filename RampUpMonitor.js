const factory = (options) => {  
  let rampUpCounter = options.numberOfConcurrentRequests,
    onRampUpComplete = options.onRampUpComplete,
    onNewRequestorStarted = options.onNewRequestorStarted;

  const requestorStarted = () => {
    rampUpCounter--;

    if (onNewRequestorStarted) onNewRequestorStarted();

    if (onRampUpComplete && rampUpCounter == 0) onRampUpComplete();
  };

  return {
    requestorStarted
  };
};

module.exports = factory;