const linearRampupFuncFactory = (rampUpTimeInSeconds, targetThroughput) => {
  const slope = targetThroughput / rampUpTimeInSeconds;

  return (timeElapsedInSeconds) => {
    return slope * timeElapsedInSeconds;
  };
};

const getFactory = (degree) => {
  switch (degree) {
    case 1:
      return linearRampupFuncFactory;
    default: 
      throw Error('unsupported degree ' + degree);
  }
};

const factory = (options) => {
  const targetThroughput = options.targetThroughput,
    rampUpTimeInSeconds = options.rampUpTimeInSeconds,
    rampUpEquationDegree = options.rampUpEquationDegree;


  // start with a linear rampup implementation and then add support for others later using math.js calculus functions
  // for a non-linear rampup graph, can I do the following?  (YES, this will work!)
    // integrate y=mx+b to whatever order is needed
    // given y = targetThroughput and x = rampUpTime, solve for m
    // plug m back into equation to get rampup function
      // use mathjs to integrate:  http://mathjs.org/docs/expressions/algebra.html
      // use algebrajs to solve for m:  https://github.com/nicolewhite/algebra.js
      // to parse & evaluate an expression in mathjs, use math.parse.eval()

  return getFactory(rampUpEquationDegree)(rampUpTimeInSeconds, targetThroughput);
};

module.exports = factory;