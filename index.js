const postcss = require('postcss');
const parser = require('postcss-values-parser');

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
*	resolution-independence conversion, and instead should be 1:1 converted to our `_unit` unit.
* @property {Number} minUnitSize=1 - The minimum unit size (as an absolute value) that any
*	measurement should be valued at the lowest device resolution we wish to support. This allows
*	for meaningful measurements that are not unnecessarily scaled down excessively.
* @property {Number} minSize=16 - The root font-size corresponding to the lowest device resolution
*	we wish to support. This is utilized in conjunction with the `minUnitSize` property.
* @property {Number} precision=5 - How precise our measurements will be, namely the maximum amount
*	of fractional digits that will appear in our converted measurements.
*/
module.exports = postcss.plugin('postcss-resolution-independence',
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

	return (css) => {
		css.walkDecls(decl => {
			const nodes = parser(decl.value, {loose: true}).parse()
			nodes.walkNumberNodes(numberNode => {
				const value = parseFloat(numberNode.value)
				// The standard unit to convert (if no unit, we assume the base unit)
				if (numberNode.unit === unit) {
					const scaledValue = Math.abs(value * minScaleFactor);
					if(scaledValue && scaledValue <= minUnitSize) {
						numberNode.value = Math.abs(value) < minUnitSize ? value : minUnitSize * (value < 0 ? -1 : 1);
						numberNode.unit = unit;
					} else {
						numberNode.value = parseFloat((value / baseSize).toFixed(precision));
						numberNode.unit = riUnit;
					}
				} else if (numberNode.unit === absoluteUnit) {
					// The absolute unit to convert to our standard unit
					numberNode.value = value;
					numberNode.unit = unit;
				}
			});
			decl.value = nodes.toString();

			//console.log(decl.value)
			//console.log(parser(decl.value, {loose:true}).parse().first)
			//process.exit(0)
		});
	};
});
