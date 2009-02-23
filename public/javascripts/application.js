// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
if (Effect && Effect.DefaultOptions)
  Effect.DefaultOptions.duration = 0.2;

var DrawDrawDraw = {};

DrawDrawDraw.Draw = {

  start: function(item_id) {
    if (!this.canvas)
      this.setupCanvas();

    this.item_id = item_id;
    this.container.show();

    return false;
  },

  stop: function() {
    if (this.ctx) {
      if (this.canvas.toDataURL) {
        var url = this.canvas.toDataURL();
        this.drawCanvas(url);

        new Ajax.Request('/canvases',
          { parameters: {'canvas[data]': url, 'canvas[item_id]': this.item_id}
          });
      }

      this.container.hide();
    }

    return false;
  },

  setupCanvas: function() {
    var v = document.viewport.getDimensions();
    this.canvas = new Element('canvas',
      {id: 'canvas', width: v.width, height: v.height, 'class': 'canvas'});
    this.container = $('canvas_container');
    this.container.insert(this.canvas);

    Event.observe(this.canvas, 'mousedown', this.mouseDown.bindAsEventListener(this));
    Event.observe(this.canvas, 'mouseup', this.mouseUp.bindAsEventListener(this));
  },

  mouseDown: function(e) {
    this.ctx = this.canvas.getContext('2d');
    this.ctx.beginPath();

    var p = this.getPoint(e);
    this.ctx.moveTo(p.x, p.y);

    if (!this.boundMouseMove)
      this.boundMouseMove = this.mouseMove.bindAsEventListener(this);
    Event.observe(this.canvas, 'mousemove', this.boundMouseMove);
  },

  mouseUp: function(e) {
    Event.stopObserving(this.canvas, 'mousemove', this.boundMouseMove);
  },

  mouseMove: function(e) {
    var p = this.getPoint(e);
    this.ctx.lineTo(p.x, p.y);
    this.ctx.stroke();
  },

  getPoint: function(e) {
    var offset = this.canvas.cumulativeOffset();
    var x = e.pointerX() - offset.left,
        y = e.pointerY() - offset.top;
    return {x: x, y: y}
  },
  
  drawCanvas: function(url) {
    $('page').absolutize();
    $('page').style.zIndex = 2;
    $('header').absolutize();
    $('header').style.zIndex = 3;
    var img = new Element('img',
      {src: url, style: 'z-index: 1;', 'class': 'canvas'});
    document.body.insert(img);
  }

};
