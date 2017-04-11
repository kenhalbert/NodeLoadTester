# NodeLoadTester

## Overview
A simple load testing tool I built at work after feeling very disappointed and frustrated with alternatives like JMeter.

Use this if you need to test that a service/website can handle a given throughput (in requests per second).  Also supports ramping up (e.g. if you need to start with 1 request every few seconds and then ramp up to 100 requests per minute over the course of a few minutes), which I've found useful for testing autoscaling configurations in AWS.
## Installation & Setup
1.  Pull down the source
2.  `npm install`
3.  `node index <args>`

## Usage
First you'll need to implement your own requestor module.  A requestor is just a function that returns an ES6 promise.  Use the example requestor (./requestors/example.js) as a starting point.  You don't have to use superagent; you can do whatever you need to in a requestor.  Just be sure it returns an ES6 promise.

After you've created your requestor, run the app like this:
`node index --requestor ./require/path/to/myrequestor.js --throughput 100 --rampUpTimeInSeconds 60`

The requestor & throughput arguments are required.  If no rampup time is specified, it will default to 0.  Throughput is in requests per second - change it to whatever you need it to be.