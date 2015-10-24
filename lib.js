function empty() {}

function BJObject() {
	this._now = null;
	this.speed = 0;
	this.direct = new BJDirect(0, 0);
	this.subObjects = [];
}
BJObject.prototype.initWithId = function(id) {
	this.canvasId = id;
	this.initWithCanvas(document.getElementById(id));
};
BJObject.prototype.initWithCanvas = function(canvas) {
	this.canvas = canvas;
	this.initWithContext(canvas.getContext('2d'));
};
BJObject.prototype.initWithContext = function(context) {
	this.context = context;
};
BJObject.prototype.decorate = function(obj) {
	obj.decorate && obj.decorate(this.context);
	return this;
};
BJObject.prototype.location = empty;
BJObject.prototype.face = empty;
BJObject.prototype.draw = this._draw
BJObject.prototype._draw = function() {
	this.location();
	this.face();
	if (this.draw !== this._draw) {
		this.draw();
	}
	this.subObjects.forEach(function(obj) {
		obj._draw();
	});
};
BJObject.prototype.draw = BJObject.prototype._draw;
BJObject.prototype.addSubObject = function(subObject) {
	subObject.initWithContext(this.context);
	this.subObjects.push(subObject);
};

function BJDecoratable() {

}
BJDecoratable.prototype = new BJObject();
BJDecoratable.prototype.decorate = function(context) {
	return this;
}

function BJRect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
BJRect.prototype = new BJDecoratable();
BJRect.prototype.drawOn = function(context) {
	context.fillRect(this.x, this.y, this.w, this.h);
};
BJRect.prototype.decorate = function(context) {
	this.context = context;
	return this;
};
BJRect.prototype.X = function(speed, direct) {
	if (this._now === null) {
		this._now = Date.now();
		return;
	}
	var det = speed / 1000 * (Date.now() - this._now);
	this.x += det * direct.x;
	this.y += det * direct.y;
	this._now = Date.now();
	return this;
};

function BJStyle(color) {
	this.color = color;
}
BJStyle.prototype = new BJDecoratable();
BJStyle.prototype.decorate = function(context) {
	context.fillStyle = this.color;
};

function BJDirect(x, y) {
	var length = Math.sqrt(x * x + y * y);
	this.x = x / length;
	this.y = y / length;
}

function BJView(rect, style) {
	this.rect = rect;
	this.style = style;
}
BJView.prototype = new BJObject();
BJView.prototype.draw = function() {
	this.decorate(this.style);
	this.rect.drawOn(this.context);
}
BJView.prototype.location = function() {
	this.rect.X(this.speed, this.direct);
}

var BJWindow = new BJObject();
BJWindow.face = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

requestAnimationFrame(function() {
	BJWindow.draw();
	requestAnimationFrame(arguments.callee);
});