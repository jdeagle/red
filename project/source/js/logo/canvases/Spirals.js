define(function (require) {

	"use strict";

	var ImageCache = require("../images/ImageCache"),
		ImageData = require("../images/ImageData"),
		SRC = '/project/static/img/tesla.jpg',
		shapes = [],
		baseSize = Math.round(Math.random() * (50 - 10) + 10);

	function Circle(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		shapes.push(this);
	}

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
			console.log("size: ", baseSize);
			shapes.push(new Circle(this.width * 0.5, this.height * 0.5, baseSize));
			// shapes.push(new Circle(this.randXCenter(), this.randYCenter(), baseSize));
			// shapes.push(new Circle(this.randXCenter(), this.randYCenter(), baseSize));
			// shapes.push(new Circle(this.randXCenter(), this.randYCenter(), baseSize));

			shapes.push(new Circle(this.width * 0.5, this.height * 1.5, baseSize));
			shapes.push(new Circle(-this.width * 0.5, this.height * 0.5, baseSize));
			shapes.push(new Circle(this.width * 1.5, this.height * 0.5, baseSize));
			shapes.push(new Circle(this.width * 0.5, -this.height * 0.5, baseSize));

			this.image.setWidthAndHeight(this.width, this.height);
			this.image.rebuild();
		},

		destroy : function () {
			this.removeShapes();
			shapes = null;
			this.sup();
		},

		drawAtPercent : function (t) {
			var size = shapes[0].radius + (baseSize * 0.5),//Math.sqrt(Math.max(9, 1000 - 3000 * t)),
				count = 5 + t * 500,
				circle = null;

			//console.log(size);

			for (var i = 0, l = shapes.length; i < l; i++) {
				circle = shapes[i];
				circle.radius = size;
				this.drawCircle(circle);
			}
		},

		drawCircle : function (circle) {
			// var x = this.randXCenter(),
			// 	y = this.randY();
			//this.fillStyle("rgb(0, 0, 0)");

			//this.fillStyle(this.gradientMapHex(this.image.getPixelClamped(x, y)));
			//this.lineWidth = 15;
			this.strokeStyle("rgb(200, 0, 0)");

			this.beginPath();
			this.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false).stroke();
			this.closePath();

		},

		removeShapes : function () {
			for (var i = 0, l = shapes.length; i < shapes.length; i++) {
				var shape = shapes.pop();
			}
		}

	});
});