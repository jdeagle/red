/*jshint newcap:false*/
define(function (require) {

	"use strict";

	var Box2D = require('box2d'),

		b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2AABB = Box2D.Collision.b2AABB,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2MassData = Box2D.Collision.Shapes.b2MassData,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,

		INSIDE = [
		[0, 0, 9.4, 0, 9.4, 34, 0, 34],
		[9.4, 16.3, 15.7, 16.3, 23.2, 22.2, 13.6, 23.7, 9.4, 23.7],
		[13.6, 23.7, 23.2, 22.2, 31.4, 34, 20.4, 34],
		[15.7, 16.3, 18.5, 15.8, 27, 19.7, 23.2, 22.2],
		[29.8, 15.2, 27, 19.7, 18.5, 15.8, 20.2, 14.3],
		[20.2, 14.3, 20.7, 12.3, 30.2, 12.3, 29.8, 15.2],
		[9.4, 0, 16.4, 0, 23.2, 1.1, 15.6, 8.1, 9.4, 8.1],
		[15.6, 8.1, 23.2, 1.1, 27.2, 3.7, 18, 8.5],
		[18, 8.5, 27.2, 3.7, 29.5, 7.1, 20.1, 10],
		[20.1, 10, 29.5, 7.1, 30.2, 12.3, 20.7, 12.3],

		[35, 0, 44.4, 0, 44.4, 34, 35, 34],
		[44.4, 0, 62.5, 0, 62.5, 8, 44.4, 8],
		[44.4, 13.2, 60.8, 13.2, 60.8, 20.6, 44.4, 20.6],
		[44.4, 26, 62.5, 26, 62.5, 34, 44.4, 34],

		[67.5, 0, 77, 0, 77, 34, 67.5, 34],
		[77, 0, 80.7, 0, 80.8, 8.3, 77, 8.3],
		[80.7, 0, 86.4, 0.5, 91.5, 2.3, 85.2, 9.1, 80.8, 8.3],
		[91.5, 2.3, 95.4, 5.2, 98, 8.7, 89, 12.2, 85.2, 9.1],
		[98, 8.7, 99.5, 12.6, 100, 16.9, 90.2, 17, 89, 12.2],
		[90.2, 17, 100, 16.9, 99.5, 20.9, 97.8, 25.5, 89.2, 21.5],
		[89.2, 21.5, 97.8, 25.5, 94.5, 29.5, 90.1, 32.3, 85.7, 24.7],
		[85.7, 24.7, 90.1, 32.3, 85.4, 33.7, 80.5, 34, 80.8, 25.7],
		[80.8, 25.7, 80.5, 34, 77, 34, 77, 25.7]
	];

	return require("../Canvas").extend({
		world : null,
		debugDraw : null,
		init : function () {
			this.sup();
			var world = this.world = new b2World(new b2Vec2(0, 10), true),
				debugDraw = this.debugDraw = new b2DebugDraw();
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
			this.makeOuter();
		},

		makeOuter : function () {
			var i, j;
			for (i = 0; i < INSIDE.length; i++) {
				this.makeSolid(INSIDE[i]);
			}
		},

		makeSolid : function (p) {
			var bodyDef = new b2BodyDef(),
				fixDef = new b2FixtureDef(),
				points = [],
				i;

			for (i = 0; i < p.length; i += 2) {
				points.push(new b2Vec2(p[i], p[i + 1]));
			}

			console.log(points);

			bodyDef.type = b2Body.b2_staticBody;

			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;
			fixDef.shape = new b2PolygonShape();
			fixDef.shape.SetAsArray(points, points.length);

			this.world.CreateBody(bodyDef).CreateFixture(fixDef);
		},

		prepare : function () {
			this.debugDraw.SetDrawScale(this.width / 100);
			this.debugDraw.SetSprite(this.ctx);
		},

		draw : function (t) {
			this.world.DrawDebugData();
		}
	});
});