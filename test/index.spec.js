const chai = require('chai');
const postcss = require('postcss');
const {parse} = require('postcss-values-parser');
const riPlugin = require('..');

global.expect = chai.expect;
let opts;

const processValue = ({css, value = 48, unit = 'px'} = {}) => (
	postcss([riPlugin(opts)])
			.process(css || `width: ${value}${unit};`, {from: undefined})
			.then(function (result) {
		return parse(result.root.nodes[0].value, {ignoreUnknownWords:true});
	})
);

describe('resolution-independence options', function () {
	beforeEach(function () {
		opts = {
			baseSize: 24,
			riUnit: 'rem',
			unit: 'px',
			absoluteUnit: 'apx',
			minUnitSize: 1,
			minSize: 16,
			precision: 5
		};
	});

	it('should handle the baseSize option', function () {
		opts.baseSize = 32;
		return processValue().then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(1.5);
			expect(out.nodes[0].unit).to.equal('rem');
		});
	});

	it('should handle the riUnit option', function () {
		opts.riUnit = 'vh';
		return processValue().then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(2);
			expect(out.nodes[0].unit).to.equal('vh');
		});
	});

	it('should handle the unit option', function () {
		opts.unit = 'em';
		return processValue({unit: 'em'}).then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(2);
			expect(out.nodes[0].unit).to.equal('rem');
		});
	});

	it('should handle the absoluteUnit option', function () {
		opts.absoluteUnit = 'abspx';
		return processValue({unit: 'abspx'}).then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(48);
			expect(out.nodes[0].unit).to.equal('px');
		});
	});

	it('should handle a minUnitSize option value of 0', function () {
		opts.minUnitSize = 0;
		return processValue({value: 0.24}).then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(0.01);
			expect(out.nodes[0].unit).to.equal('rem');
		});
	});

	it('should handle the minUnitSize option', function () {
		opts.minUnitSize = 10;
		return processValue({value: 9}).then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(9);
			expect(out.nodes[0].unit).to.equal('px');
		});
	});

	it('should handle the minSize option', function () {
		opts.minSize = 12;
		opts.minUnitSize = 24;
		return processValue().then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(24);
			expect(out.nodes[0].unit).to.equal('px');
		});
	});

	it('should handle the precision option', function () {
		opts.baseSize = 33;
		opts.precision = 2;
		return processValue().then(out => {
			expect(parseFloat(out.nodes[0].value)).to.equal(1.45);
			expect(out.nodes[0].unit).to.equal('rem');
		});
	});

});

describe('resolution-independence conversions', function () {
	before(function () {
		opts = {
			baseSize: 24,
			riUnit: 'rem',
			unit: 'px',
			absoluteUnit: 'apx',
			minUnitSize: 1,
			minSize: 16,
			precision: 5
		};
	});

	it('should convert single string values', function () {
		const css = 'width: 48px;'
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('2rem');
		});
	});

	it('should convert complex string values (url that contains delimiters)', function () {
		const css = 'background: url("https://developer.mozilla.org/samples/cssref/images/startransparent.gif") #FFEE99 2rem bottom no-repeat;';
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('url("https://developer.mozilla.org/samples/cssref/images/startransparent.gif") #FFEE99 2rem bottom no-repeat');
		});
	});

	it('should convert complex string values (lack of whitespace, comma-separated)', function () {
		const css = 'background-size: 48px 2.4px,36px,24px !important;';
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('2rem 0.1rem,1.5rem,1rem');
		});
	});

	it('should convert function parameters', function () {
		const css = 'transform: translate3d(48px, 36px, 18px);';
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('translate3d(2rem, 1.5rem, 0.75rem)');
		});
	});

	it('should convert nested function parameters', function () {
		const css = '-webkit-mask-image: -webkit-linear-gradient(top, rgba(0,255,255,0), rgba(255,255,0,1) 18px, rgba(255,255,0,0) 60px, rgba(0,255,255,0));';
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('-webkit-linear-gradient(top, rgba(0,255,255,0), rgba(255,255,0,1) 0.75rem, rgba(255,255,0,0) 2.5rem, rgba(0,255,255,0))');
		});
	});

	it('should ignore unit-less values', function () {
		const css = 'opacity: 0.5;';
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('0.5');
		});
	});

	it('should ignore alternative measurement units', function () {
		const css = 'width: 50%;';
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('50%');
		});
	});

	it('should properly handle properties without measurement values that accept csv\'s', function () {
		const css = 'background: rgba(50, 50, 50, 0.8);';
		return processValue({css}).then(out => {
			expect(out.toString()).to.equal('rgba(50, 50, 50, 0.8)');
		});
	});
});
