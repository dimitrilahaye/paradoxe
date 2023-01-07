const frameRate = (rate: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
	const original = descriptor.value;
	let nextActivability = 0;
  
	descriptor.value = function (...args) {
		const now = new Date().getTime();
		if (now > nextActivability) {
			nextActivability = now + rate;
			original.call(this, ...args);
		}
	};
};

export default frameRate;