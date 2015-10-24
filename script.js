BJWindow.initWithId('stage');
var style = new BJStyle('#61665f');
var rect = new BJRect(0,0,80,60);
var view = new BJView(rect, style);
view.face = function(){
	var color = '#' + Math.random().toString(16).slice(-6);
	// console.log(color);
	this.style = new BJStyle(color);
	// this.rect = new BJRect(Date.now()%800, Date.now()%600, 80, 60);
};
view.speed = 100;
view.direct = new BJDirect(1, 1);
BJWindow.addSubObject(view);