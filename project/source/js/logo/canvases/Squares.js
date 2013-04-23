define(function (require) {

	"use strict";

	var ImageCache = require("../images/ImageCache"),
		ImageData = require("../images/ImageData"),
		SRC = '/project/static/img/tesla.jpg',
		shapes = [],
		size = Math.random() * (35 - 5) + 5;

	function Square(x, y, size) {
		this.x = x;
		this.y = y;
		this.percentShown = 0;
		this.size = size;
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

			this.percentShown += (1 - this.percentShown) * 0.5;
			this.percentShown = (this.percentShown > 0.99) ? 1 : this.percentShown;

			if (this.percentShown === 1) {
				this.dirty = false;
			}

			return (this.size * this.percentShown);
		}
	};

	// preload images
	ImageCache.load(SRC);

	return require("../Canvas").extend({

		init : function () {
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



			this.originX = Math.floor(Math.random() * cols);
			this.originY = Math.floor(Math.random() * rows);

			this.drawFromCenter = Math.round(Math.random()) > 0;

			for (var i = 0; i < rows; i++) {
				for (var n = 0; n < cols; n++) {
					var shape = new Square(n * size, i * size, size);
					//shape.delay = Math.max(Math.random() * i, 0.1);
					if (this.drawFromCenter) {
						shape.delay = this.getAngle(n, i, cols, rows) * 0.5 + 0.1;
					} else {
						shape.delay = (i / 2) + Math.max(Math.random() * (i / 2), 0.1);
					}
				}
			}

			this.shuffled = this.shuffle(shapes.slice(0));
		},

		destroy : function () {
			this.removeShapes();
			shapes = null;
			this.sup();
		},

		getAngle : function (x, y, cols, rows) {

			var distanceX = Math.abs(x - this.originX);//Math.abs(x - cols * 0.5);
			var distanceY = Math.abs(y - this.originY);//Math.abs(y - rows * 0.5);

			return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

		},

		getDistanceFromCenter : function (i, total) {
			var center = Math.round(total * 0.5);

			return Math.abs(i - center);
		},

		shuffle : function (o) { //http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
			for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		},

		draw : function () {

			// var sample = [];

			// for (var i = 0; i < 5; i++) {
			// 	var id = Math.floor(Math.random() * shapes.length);
			// 	sample.push(shapes[id]);
			// }

			//this.drawSquares(sample);

			// mark square as dirty
			// for (var i = 0; i < 2; i++){
			// 	if (this.shuffled.length > 0) {
			// 		var square = this.shuffled.pop();
			// 		square.dirty = true;
			// 	}
			// }

			this.drawAllSquares();
		},

		drawAtPercent : function (t) {
			//console.log("drawAtPercent", t);
			// var size = Math.sqrt(Math.max(9, 1000 - 3000 * t)),
			// 	count = 5 + t * 500,
			// 	i = -1;
			// while (++i < count) {
			// 	this.drawCircle(size);
			// }

			//drawSquares();

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
			this.fillStyle(this.gradientMapHex(this.image.getPixelClamped(shape.x, shape.y)));
			this.fillRect(shape.x, shape.y, shape.size, shape.getSliver());
		},

		removeShapes : function () {
			for (var i = 0, l = shapes.length; i < shapes.length; i++) {
				var shape = shapes.pop();
			}
		}

	});
});