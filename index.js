const {parse} = require('postcss-values-parser');

/**
* The configurable options that can be passed into `ResolutionIndependence`.
*
* @typedef {Object} ResolutionIndependence~Options
* @property {Number} baseSize=24 - The root font-size we wish to use to base all of our conversions
*	upon.
* @property {String} riUnit="rem" - The unit of measurement we wish to use for resolution-independent
*	units.
* @property {String} unit="px" - The unit of measurement we wish to convert to resolution-independent
*	units.
* @property {String} absoluteUnit="apx" - The unit of measurement to ignore for
*	resolution-independence conversion, and instead should be 1:1 converted to our `unit` unit.
* @property {Number} minUnitSize=1 - The minimum unit size (as an absolute value) that any
*	measurement should be valued at the lowest device resolution we wish to support. This allows
*	for meaningful measurements that are not unnecessarily scaled down excessively.
* @property {Number} minSize=16 - The root font-size corresponding to the lowest device resolution
*	we wish to support. This is utilized in conjunction with the `minUnitSize` property.
* @property {Number} precision=5 - How precise our measurements will be, namely the maximum amount
*	of fractional digits that will appear in our converted measurements.
*/
module.exports =
		({
			baseSize = 24,
			riUnit = 'rem',
			unit = 'px',
			absoluteUnit = 'apx',
			minUnitSize = 1,
			minSize = 16,
			precision = 5
		} = {}) => {
	const minScaleFactor = minSize / baseSize;

	return {
		postcssPlugin: 'postcss-resolution-independence',
		Once (css) {
			css.walkDecls(decl => {
				const nodes = parse(decl.value, {ignoreUnknownWords: true})
				nodes.walkNumerics(node => {
					const value = parseFloat(node.value)
					// The standard unit to convert (if no unit, we assume the base unit)
					if (node.unit === unit) {
						const scaledValue = Math.abs(value * minScaleFactor);
						if (scaledValue && scaledValue <= minUnitSize) {
							if (Math.abs(value) >= minUnitSize) {
								node.value = minUnitSize * (value < 0 ? -1 : 1);
							}
						} else {
							node.value = parseFloat((value / baseSize).toFixed(precision));
							node.unit = riUnit;
						}
					} else if (node.unit === absoluteUnit) {
						// The absolute unit to convert to our standard unit
						node.unit = unit;
					}
				});
				decl.value = nodes.toString();
			});
		}
	};
};


module.exports.postcss = true

