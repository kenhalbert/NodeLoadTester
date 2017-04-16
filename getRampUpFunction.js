const algebra = require('algebra.js');

const rampUpEquationsByDegree = {
  1: (variables) => {
    const y = variables.y || 'y',
      x = variables.x || 'x',
      m = variables.m || 'm';

      return `${y} = ${m}*${x}`;
  }
};

const nthDegreeRampUpFuncFactory = (rampUpTimeInSeconds, targetThroughput, degree) => {
  const equation = rampUpEquationsByDegree[degree];

  if (!equation) 
    throw Error(`Currently there's no support for degree ${degree}, but you're free to add it yourself if you need it.`)

  const parameterizedEquation = equation({ 
    x: rampUpTimeInSeconds,
    y: targetThroughput
  });
  console.log(parameterizedEquation);
  const slope = algebra.parse(parameterizedEquation).solveFor('m');

  return (runTimeInSeconds) => {
    const expression = equation({
      m: slope,
      x: runTimeInSeconds
    });

    const currentThroughput = algebra.parse(expression).solveFor('y');

    return currentThroughput.numer / currentThroughput.denom;
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

  return nthDegreeRampUpFuncFactory(rampUpTimeInSeconds, targetThroughput, rampUpEquationDegree);
};

module.exports = factory;