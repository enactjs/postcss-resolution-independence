const postcss = require('postcss');

module.exports = postcss.plugin('myplugin', function(options = {}) {
	return function (css) {
		// Processing code will be added here
	}
});