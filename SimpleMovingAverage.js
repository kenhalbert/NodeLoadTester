const factory = (options) => {
	const dataPoints = [],
		datasetSize = options.datasetSize;
	let value = null;

	const updateDataset = (time) => {
		if (dataPoints.length >= datasetSize)
			dataPoints.pop();

		dataPoints.push(time);
	};

	const average = (dataSet) => {
		let sum = 0;

		// using simple loop here instead of reduce for performance
		for (let i = 0; i < dataSet.length; i++)
			sum += parseInt(dataSet[i], 10);

		return sum/dataSet.length;
	};

	const updateValue = () => {
		value = average(dataPoints)
	};

	const update = (time) => {
		updateDataset(time);
		updateValue();
	};

	const getCurrentValue = () => value;

	return {
		update,
		getCurrentValue
	}
};

module.exports = factory;