define(function (require) {

	"use strict";

	var ImageCache = require("../images/ImageCache"),
		ImageData = require("../images/ImageData"),
		SRC = '/project/static/img/tesla.jpg',
		shapes = [],
		size = 1;//Math.random() * (35 - 5) + 5;

	function Square(x, y, size) {
		this.x = x;
		this.y = y;
		this.percentShown = 0;
		this.size = size;
		this.imageData = null;
		this.dirty = false;
		this.delay = 0;
		shapes.push(this);
	}

	Square.prototype = {
		tick : function () {
			if (this.delay > 0) {
				this.delay -= 0.300;
				if (this.delay <= 0) {
					this.dirty = true;
				}
			}
		},
		getSliver : function ()  {

			this.dirty = false;

			return 1;
		}
	};

	// preload images
	ImageCache.load(SRC);

	return require("../Canvas").extend({

		init : function () {
			this.forceForeground = true;
			this.image = new ImageData();
			this.image.setSrc(SRC);
			this.image.setScaleMode('cover');
			this.sup();
		},

		prepare : function () {

			shapes = [];

			this.image.setWidthAndHeight(this.width, this.height);
			this.image.rebuild();

			// create grid
			var cols = Math.ceil(this.width / size),
				rows = Math.ceil(this.height / size);

			for (var i = 0; i < rows; i++) {
				for (var n = 0; n < cols; n++) {
					var shape = new Square(n * size, i * size, size);
					shape.imageData = this.image.getPixelClamped(shape.x, shape.y);
					shape.fill = this.gradientMapHex(shape.imageData);
					shape.delay = (i / 2) + Math.max(Math.random() * (i / 2), 0.1);
				}
			}

			this.shuffled = this.shuffle(shapes.slice(0));

			this.isForeground = true;

		},

		destroy : function () {
			this.removeShapes();
			shapes = null;
			this.sup();
		},

		shuffle : function (o) { //http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
			for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		},

		draw : function () {

			var sample = [],
				l = this.shuffled.length;
			if (l > 0) {
				for (var i = 0; i < 1500; i++) {
					if (this.shuffled.length > 0) {
						var id = Math.floor(Math.random() * shapes.length);
						sample.push(this.shuffled.pop());
					}
				}
				this.drawSquares(sample);
			}
			//this.drawAllSquares();
		},

		drawSquares : function (squares) {
			//console.log("shapes", shapes.length);
			for (var i = 0, l = squares.length; i < l; i++) {
				this.drawSquare(squares[i]);
			}
		},

		drawAllSquares : function () {
			//console.log("shapes", shapes.length);
			for (var i = 0, l = shapes.length; i < l; i++) {
				var shape = shapes[i];
				shape.tick();
				if (shape.dirty) {
					this.drawSquare(shape);
				}
			}
		},

		drawSquare : function (shape) {
			//this.fillStyle("rgb(200, 0, 0)");
			this.fillStyle(shape.fill);
			this.fillRect(shape.x, shape.y, shape.size, shape.getSliver());
			//shape.imageData = this.image.getPixelClamped(shape.x, shape.y);
			//this.putImageData(shape.imageData, shape.x, shape.y);
		},

		removeShapes : function () {
			for (var i = 0, l = shapes.length; i < shapes.length; i++) {
				var shape = shapes.pop();
			}
		}

	});
});