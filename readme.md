# node-load-tester

A simple load testing tool I built with Node.  I wrote this because I wanted a load testing tool that requires minimal configuration and lets me do most of what I need to do in code.

Use this if you need to test that a service/website can handle a given throughput (in requests per second).  Also supports ramping up (e.g. if you need to start with 1 request every few seconds and then ramp up to 100 requests per minute over the course of a few minutes), which I've found useful for testing autoscaling configurations in AWS.

## Installation & Setup
1.  Pull down the source
2.  `npm install`
3.  `node index <args>`

## Usage
First you'll need to implement your own requestor module.  A requestor is just a function that returns an ES6 promise.  Use the example requestor (./requestors/example.js) as a starting point.  You don't have to use superagent; you can do whatever you need to in a requestor.  Just be sure it returns an ES6 promise.

After you've created your requestor, run the app like this:
`node index --requestor ./require/path/to/myrequestor.js --throughput 100 --rampUpTimeInSeconds 60 --rampUpEquationDegree 1`

The `requestor` & `throughput` arguments are required.  If no `rampUpTimeInSeconds` is specified, it will default to 0.  If you do specify a rampup time, you can also optionally set a value for `rampUpEquationDegree` (see below) - if you don't, it will default to 1.  Throughput is in requests per minute - change it to whatever you need it to be.  

The `rampUpEquationDegree` argument determines the degree of the equation used to calculate throughput during the rampup period.  Using the default value of 1, rampup will be linear and throughput will increase linearly as a function of time.  If you set the value to 2, rampup will be quadratic and throughput will increase exponentially (by a power of 2) as a function of time.
