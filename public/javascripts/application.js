// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
if (Effect && Effect.DefaultOptions)
  Effect.DefaultOptions.duration = 0.2;

var DrawDrawDraw = {};

DrawDrawDraw.Draw = Class.create({
  initialize: function(options) {
    this._div = $(options.div);
    this._canvases = {};
    this._createElements();
    this._setupObservers();
    this._update();

    if (options.interval) {
      setInterval(this._update.bind(this), options.interval);
    }
  },

  setStrokeStyle: function(s) {
    this._ctx.strokeStyle = s;
  },

  setLineWidth: function(w) {
    this._ctx.lineWidth = w;
  },

  _createElements: function() {
    var dim = document.viewport.getDimensions();
    var top = this._div.cumulativeOffset().top;
    this._canvas = new Element('canvas', {
      width: dim.width, height: dim.height - top
    });
    this._div.insert(this._canvas);

    this._ctx = this._canvas.getContext('2d');
  },

  _setupObservers: function() {
    this._canvas.observe('mousedown', this._mouseDown.bindAsEventListener(this));
    this._canvas.observe('mouseup', this._mouseUp.bindAsEventListener(this));
  },

  _mouseDown: function(e) {
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
    this._ctx.beginPath();
    this._ctx.moveTo(p.x, p.y);
  },

  _getPoint: function(e) {
    var offset = this._canvas.cumulativeOffset();
    var x = e.pointerX() - offset.left,
        y = e.pointerY() - offset.top;
    return { x: x, y: y };
  },

  _save: function() {
    if (this._canvas.toDataURL) {
      var data = this._canvas.toDataURL();
      this._draw(data);
      this._clear();

      var params = { 'canvas[data]': data };
      Object.extend(params, DrawDrawDraw.AuthenticityToken);
      var r = new Ajax.Request('/canvases.json', {
        parameters: params
      });
    } else {
      alert("Can't save! Oh NO!");
    }
  },

  _clear: function() {
    var dim = this._canvas.getDimensions();
    this._ctx.clearRect(0, 0, dim.width, dim.height);
  },

  _update: function() {
    if (!this._updateSuccess) {
      this._updateSuccess = function(t) {
        t.responseJSON.each(function(canvas) {
          this._draw(canvas.canvas.data);
          this._since = canvas.canvas.created_at;
        }, this);
      }.bind(this);
    }

    if (!this._updateFailure) {
      this._updateFailure = function(t) {
        if (t.status == 417) {  // clear on expectation failed
          this._div.select('img.canvas').invoke('remove');
        }
      }.bind(this);
    }

    new Ajax.Request('/canvases.json', {
      method: 'GET',
      parameters: { since: this._since },
      onSuccess: this._updateSuccess,
      onFailure: this._updateFailure
    });
  },
  
  _draw: function(url) {
    if (!this._canvases[url]) {
      this._canvases[url] = true;

      var img = new Element('img', {
        src: url, 'class': 'canvas'
      });
      this._div.insert(img);
    }
  }
});
