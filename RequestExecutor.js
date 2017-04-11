const factory = (options) => {
	const terminateOnError = options.terminateOnError == undefined 
			? true 
			: options.terminateOnError,
		makeRequest = options.requestor,
		requestStats = options.requestStats,
		requestTimeAverageInMilliseconds = options.requestTimeAverageInMilliseconds;

	const handleRequestFinish = (startTime) => {
		requestStats.requestsFinished++;
    	requestTimeAverageInMilliseconds.update(new Date() - startTime);
	};

	const handleRequestError = (err) => {
		console.log('endpoint response does not indicate success', err);

		if (terminateOnError)
			process.exit();
	};

	const executeRequest = () => {
		const startTime = new Date();

		requestStats.requestsStarted++;

		makeRequest()
			.then(() => {
				handleRequestFinish(startTime);
			})
			.catch((err) => {
				handleRequestFinish(startTime);
				handleRequestError(err);
			});
	};

	return executeRequest;
};

module.exports = factory;