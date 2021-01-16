"use strict";

// Quick actions
self["$"] = self["$"] || function (selector, source) {
	var src = source || document;
	return src.querySelector(selector);
};
self["$$"] = self["$$"] || function (selector, source) {
	var src = source || document;
	return Array.from(src.querySelectorAll(selector));
};
HTMLElement.prototype.$ = function (selector) {
	return $(selector, this);
};
HTMLElement.prototype.$$ = function (selector) {
	return $$(selector, this);
};
var generateRandom = function (length) {
	var tmp = "";
	var map = "0123456789abcdefghijklmnopqrstuvwxyz_-";
	for (var tick = 0; tick < length; tick ++) {
		tmp += map[Math.floor(Math.random() * map.length)];
	};
	return tmp;
};

var WCSMS = {}, WCSME = {}; // Webcirque Custom Script Maintained Styles
// Content of the maintained CSS
/*
 * the speed factor of the scroller can be adjusted upon demand
 * it's correct 1x speed must be 48 pixels per second.
*/
WCSMS.scroller = {
	prop: "wcsms-textDial-${id} ${duration}s linear infinite",
	frames: "@keyframes wcsms-textDial-${id} {\n	0% {\n		left: 0px;\n	}${stopby}\n	100% {\n		left: -${end}px;\n	}\n}",
	stopbyFrame: "\n	${stopAt}% {\n 		left: -${end}px;\n	}",
	speedUnit: 48,
	speedFactor: 1,
	restTime: 2,
	gapWidth: 16,
	fps: 60
};
//Custom Element
WCSME.TextDialElement = function (element, conf = {}) {
	element.textDial = element.textDial || new (function (ele) {
		// Initiate
		var target = element;
		var intermediate = target.innerText;
		// Customized settings per element
		this.speedUnit = conf.speedUnit;
		this.speedFactor = conf.speedFactor;
		this.restTime = conf.restTime;
		this.gapWidth = conf.gapWidth;
		// Clear original context
		target.innerText = "";
		// Create dummies
		var dummy = document.createElement("span");
		var dummy1 = document.createElement("span");
		dummy1.innerText = intermediate;
		dummy.appendChild(dummy1);
		target.appendChild(dummy);
		if (dummy1.offsetWidth > target.offsetWidth) {
			var dummy2 = document.createElement("span");
			dummy2.innerText = intermediate;
			dummy2.style.marginLeft = (this.gapWidth || WCSMS.scroller.gapWidth).toString() + "px";
			dummy.appendChild(dummy2);
			this.scrollWidth = dummy2.offsetLeft;
		};
		// Scroll application (for CSS)
		this.id = generateRandom(20);
		this.hookedElement = element;
		this.text = intermediate;
		var calculated = {};
		calculated.id = this.id;
		calculated.originalDuration = (this.scrollWidth / (this.speedUnit || WCSMS.scroller.speedUnit)) / (this.speedFactor || WCSMS.scroller.speedFactor);
		calculated.duration = Math.round((calculated.originalDuration + (this.restTime || WCSMS.scroller.restTime)) * 10) / 10;
		calculated.stopby = "";
		calculated.stopAt = Math.round(calculated.originalDuration / calculated.duration * 1000) / 10;
		calculated.end = this.scrollWidth;
		if ((this.restTime || WCSMS.scroller.restTime) >= 0.05) {
			calculated.stopby = WCSMS.scroller.stopbyFrame.alter(calculated);
		};
		this.animator = WCSMS.scroller.prop.alter(calculated);
		this.animation = WCSMS.scroller.frames.alter(calculated);
		if (dummy1.offsetWidth > target.offsetWidth) {
			dummy.style.animation = this.animator;
			var managedStyle = document.createElement("style");
			managedStyle.id = "wcsms-scroller-${id}".alter(calculated);
			managedStyle.innerHTML = this.animation;
			document.head.appendChild(managedStyle);
			WCSME.TextDialElement.managed.set(this.id, this);
		};
	})(element);
	return element.textDial;
};
WCSME.TextDialElement.managed = new Map();
WCSME.TextDialElement.update = function () {};

document.addEventListener("readystatechange", function () {
	if (this.readyState == "interactive") {
		$$(".custom-textdial").forEach(function (e) {
			new WCSME.TextDialElement(e);
		});
	};
});
