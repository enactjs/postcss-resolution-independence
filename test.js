const postcss = require('postcss');
const riPlugin = require('.');

const css = `
	.class {
		width: 48px;
		background: url("https://developer.mozilla.org/samples/cssref/images/startransparent.gif") #FFEE99 48px bottom no-repeat;
		background-size: 48px 2.4px,36px.24px!important;
		transform: translate3d(48px, 36px, 18px);
		-webkit-mask-image: -webkit-linear-gradient(top, rgba(0,255,255,0), rgba(255,255,0,1) 18px, rgba(255,255,0,0) 60px, rgba(0,255,255,0));
		opacity: 0.5;
		width: 50%;
		background: rgba(50, 50, 50, 0.8);
		padding: 10apx;
		margin: 2vh;
	}
`;

postcss([riPlugin({
	baseSize: 24,
	riUnit: 'rem',
	unit: 'px',
	absoluteUnit: 'apx',
	minUnitSize: 1,
	minSize: 16,
	precision: 5
})]).process(css).then(function (result) {
	console.log(result.css)
})