# postcss-resolution-independence
> A PostCSS plugin that implements a resolution-independent scalable mechanism. 

## Example
Input:
```css
.myclass {
	width: 32px;
	height: 48px;
	border: 2apx;
}
```
Output with default options:
```css
.myclass {
	width: 1.5rem;
	height: 2rem;
	border: 2px;
}
```

## Installation

```
npm install postcss-resolution-independence
```

## Options

The plugin has no default options. Everything is disabled by default.

- `baseSize` _Number_: The root font-size we wish to use to base all of our conversions upon (default `24`).
- `riUnit` _String_:  The unit of measurement we wish to use for resolution-independent units (default `"rem"`).
- `unit` _String_: The unit of measurement we wish to convert to resolution-independent units (default `"px"`).
- `absoluteUnit` _String_: The unit of measurement to ignore for resolution-independence conversion, and instead should be 1:1 converted to our `unit` unit (default `"apx"`).
- `minUnitSize` _Number_: The minimum unit size (as an absolute value) that any measurement should be valued at the lowest device resolution we wish to support. This allows for meaningful measurements that are not unnecessarily scaled down excessively (default `1`).
- `minSize` _Number_:  The root font-size corresponding to the lowest device resolution we wish to support. This is utilized in conjunction with the `minUnitSize` property (default `16`).
- `precision` _Number_: How precise our measurements will be, namely the maximum amount of fractional digits that will appear in our converted measurements (default `5`).

## Usage

This plugin can be used like any other PostCSS plugin, by PostCSS CLI, third party tool (like Webpack `postcss-loader` or Gulp), or directly via javascript APIs. For example:
```js
const postcss = require('postcss');
const riPlugin = require('postcss-resolution-independence');

postcss([riPlugin({baseSize: 16})]).process(source).then(function (result) {
	// do something
});
```

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and documentation files in this repository are:

Copyright (c) 2019-present LG Electronics

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
