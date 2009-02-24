// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
if (Effect && Effect.DefaultOptions)
  Effect.DefaultOptions.duration = 0.2;

String.prototype.toDate = function() {
  var k = this.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})/)
  return new Date(Date.UTC(k[1],k[2]-1,k[3],k[4],k[5],k[6]));
};

var DrawDrawDraw = {};

DrawDrawDraw.Draw = Class.create({
  initialize: function(options) {
    this._div = $(options.div);
    this._createElements();
    this._setupObservers();
    this._update();

    if (options.interval) {
      setInterval(this._update.bind(this), options.interval);
    }
  },

  _createElements: function() {
    var dim = document.viewport.getDimensions();
    var top = this._div.cumulativeOffset().top;
    this._canvas = new Element('canvas', {
      width: dim.width, height: dim.height - top
    });
    this._div.insert(this._canvas);
  },

  _setupObservers: function() {
    this._canvas.observe('mousedown', this._mouseDown.bindAsEventListener(this));
    this._canvas.observe('mouseup', this._mouseUp.bindAsEventListener(this));
  },

  _mouseDown: function(e) {
    this._ctx = this._canvas.getContext('2d');
    this._ctx.beginPath();

    var p = this._getPoint(e);
    this._ctx.moveTo(p.x, p.y);

    if (!this._boundMouseMove)
      this._boundMouseMove = this._mouseMove.bindAsEventListener(this);
    this._canvas.observe('mousemove', this._boundMouseMove);
  },

  _mouseUp: function(e) {
    this._canvas.stopObserving('mousemove', this.boundMouseMove);
    this._save();
  },

  _mouseMove: function(e) {
    var p = this._getPoint(e);
    this._ctx.lineTo(p.x, p.y);
    this._ctx.stroke();
  },

  _getPoint: function(e) {
    var offset = this._canvas.cumulativeOffset();
    var x = e.pointerX() - offset.left,
        y = e.pointerY() - offset.top;
    return { x: x, y: y };
  },

  _save: function() {
    if (this._ctx) {
      if (this._canvas.toDataURL) {
        var url = this._canvas.toDataURL();
        this._draw(url);
        this._clear();

        var params = { 'canvas[data]': url };
        Object.extend(params, DrawDrawDraw.AuthenticityToken);

        var r = new Ajax.Request('/canvases.json', {
          parameters: params
        });
      } else {
        alert("Can't save! Oh NO!");
      }
    }

    return false;
  },

  _clear: function() {
    var dim = this._canvas.getDimensions();
    this._ctx.clearRect(0, 0, dim.width, dim.height);
  },

  _update: function() {
    new Ajax.Request('/canvases.json', {
      method: 'GET',
      parameters: { since: this._since },
      onSuccess: function(t) {
        t.responseJSON.each(function(canvas) {
          this._draw(canvas.canvas.data);
          this._since = canvas.canvas.created_at.toDate();
        }, this);
      }.bind(this)
    });
  },
  
  _draw: function(url) {
    var img = new Element('img', {
      src: url, 'class': 'canvas'
    });
    this._div.insert(img);
  }
});
