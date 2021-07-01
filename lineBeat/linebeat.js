"use strict";
if (!self.CanvasVisualizer) {
	self.CanvasVisualizer = function () {};
};

var thread, lineBeatOpt, changeDir;

lineBeatOpt = {
	speed: 5,
	direction: 1
};

$invoke(0, function () {
	let color = 60;
	let canvas = $("canvas"), audio = $("audio");
	let ctx = canvas.getContext("2d", {alpha: false, desynchronized: true});
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = "hsl(60 100% 50%)"
	let drawIt = function (ctx, info) {
		if (!info.media.paused) {
			let halfW = ctx.canvas.width / 2, halfH = ctx.canvas.height / 2;
			// Move canvas
			let oldImgDt = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			let tHori = 0, tVert = 0;
			color = (color + 1) % 360;
			ctx.fillStyle = `hsl(${color}, 100%, 50%)`;
			if (lineBeatOpt.direction >> 1) {
				if (lineBeatOpt.direction % 2) {
					tVert = 1;
				} else {
					tVert = -1;
				};
			} else {
				if (lineBeatOpt.direction % 2) {
					tHori = -1;
				} else {
					tHori = 1;
				};
			};
			ctx.putImageData(oldImgDt, lineBeatOpt.speed * tHori, lineBeatOpt.speed * tVert);
			// Start drawing
			ctx.fillRect(halfW - 16, halfH - 16, 32, 32);
		};
	};
	thread = setInterval(function () {
		drawIt(ctx, {media: audio});
	}, 20);
	changeDir = function () {
		let tk = lineBeatOpt.direction;
		lineBeatOpt.direction = (((tk >> 1) + 1) % 2 << 1) + (tk % 2);
	};
	canvas.addEventListener("mousedown", changeDir);
});
