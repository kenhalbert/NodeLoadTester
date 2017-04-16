const algebra = require('algebra.js');

/* I couldn't find a math library for JavaScript that can do symbolic integration.  Until I find a way to do that, I have to hard-code the
   equations I need here. 

   TODO: the collection below only contains integrals of y=mx+b, but there's no reason for the app not to support any 
   function that has terms of y, x, & m!  (and maybe soon, b)

   In fact - maybe instead of having the app do integration itself, why not just make the rampup equation fully configurable?  I think
   that would be more useful and easier to implement. 
*/
const rampUpEquationsByDegree = {
  1: (variables) => {
    const y = variables.y || 'y',
      x = variables.x || 'x',
      m = variables.m || 'm';

      return `${y} = ${m}*${x}`;
  },
  2: (variables) => {
    const y = variables.y || 'y',
      x = variables.x || 'x',
      m = variables.m || 'm';

      return `${y} = (${m}*${x}^2)/2`;
  }
};

const nthDegreeRampUpFuncFactory = (rampUpTimeInSeconds, targetThroughput, degree) => {
  const equation = rampUpEquationsByDegree[degree];

  if (!equation) 
    throw Error(`Currently there's no support for degree ${degree}, but you're free to add it yourself if you need it.`)

  const parameterizedEquation = equation({ // TODO: add support for the 'b' in y = mx+b to support rampups that don't start at 0 
    x: rampUpTimeInSeconds,
    y: targetThroughput
  });

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

  return nthDegreeRampUpFuncFactory(rampUpTimeInSeconds, targetThroughput, rampUpEquationDegree);
};

module.exports = factory;