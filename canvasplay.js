/* Canvasplay -  An HTML5 <canvas> playground to fiddle with animations in an interactive way.
 * 2012, Jean-Karim Bockstael <jkb@jkbockstael.be>
 */
var canvasPlay = function(options) {
	// Private variables
	var _dom = {
		canvas: undefined,
		code: undefined,
		framerate: undefined,
		run: undefined,
		stop: undefined,
		hide: undefined,
		switchSide: undefined,
		fullscreen: undefined
	};
	var _storedCode = "";
	var _frameCounter = 0;
	var _lastFrame = (new Date()).getTime();
	var _framerate = 60;
	var _logging = true;
	var _rafMaxId = undefined;
	var _cursor = { 
		x: 0,
		y: 0
	};

	// Constructor
	var _init = function _init(options) {
		_dom.canvas = document.getElementById(options.canvas);
		_dom.code = document.getElementById(options.code);
		_dom.run = document.getElementById(options.run);
		_dom.stop = document.getElementById(options.stop);
		_dom.framerate = document.getElementById(options.framerate);
		_dom.hide = document.getElementById(options.hide);
		_dom.switchSide = document.getElementById(options.switchSide);
		_dom.fullscreen = document.getElementById(options.fullscreen);
		_storedCode = localStorage.getItem("canvasplay_code");
		if (_storedCode !== undefined && _storedCode !== null) {
			myCodeMirror.setValue(_storedCode);
		}
		else {
			_dom.code.value = "Code here";
			_dom.code.onfocus = function _domCodeOnFocusHandler() {
				_dom.code.value = "";
				_dom.code.onfocus = undefined;
			};
		}
		_dom.code.onkeydown = function _domCodeOnKeydownHandler(e) {
			if(e.keyCode === 9) {
				var start = this.selectionStart;
				var end = this.selectionEnd;
				var value = this.value;
				this.value = value.substring(0, start)
							+ "\t"
							+ value.substring(end);

				this.selectionStart = this.selectionEnd = start + 1;
				e.preventDefault();
			}
		};
		_dom.run.onclick = _run;
		_dom.stop.disabled = true;
		_dom.stop.onclick = _stop;
		_dom.canvas.onmousemove = function _domCanvasOnMousemoveHandler(event) {
			_cursor.x = event.layerX;
			_cursor.y = event.layerY
		};
		_dom.hide.onclick = _showHide;
		_dom.switchSide.onclick = _switchSide;
		_dom.fullscreen.onclick = function _domFullscreenOnClickHandler() {
			document.documentElement.webkitRequestFullScreen();
		};
		_resizeCanvas();
		window.onresize = function windowOnResizeHandler(event){
			_resizeCanvas();
		};
	}
	
	var _requestAnimationFrame = window.requestAnimationFrame;
	window.requestAnimationFrame = function requestAnimationFrameWrapper(func) { 
		// Framerate
		var thisFrame = (new Date).getTime();
		var delta = thisFrame - _lastFrame;
		_lastFrame = thisFrame;
		_framerate = Math.floor(1000 / delta);
		if (_frameCounter % 10 === 0) {
			_dom.framerate.innerHTML = "FPS: " + _framerate;
		}
		var id = _requestAnimationFrame(func);
		_rafMaxId = id;
		_frameCounter++;
		return id;
	};

	// Implementation for public interface
	var _run = function _run() {
		var code = myCodeMirror.getValue();
		_stop();
		// Store code in local storage
		localStorage.setItem("canvasplay_code", code);
		// Have fun
		eval("var canvasplayCode = function() {" + code + "\n};");
		canvasplayCode();
		_dom.stop.disabled = false;
	};

	var _stop = function _stop() {
		// Clear any pending animation frames
		for (var i = 0, l = _rafMaxId; i <= l; i++) {
			window.cancelAnimationFrame(i);
		}
		_dom.framerate.innerHTML = "FPS: "
		// Reset canvas, the "yep this is a side-effect but it works" way
		_dom.canvas.width = _dom.canvas.width + 1;
		_dom.canvas.width = _dom.canvas.width - 1;
		_dom.stop.disabled = true;
	};
	
	var _getCanvas = function _getCanvas() {
		return _dom.canvas;
	};

	var _getCode = function _getCode() {
		return _dom.code.value;
	};

	var _getFramerate = function _getFramerate() {
		return _framerate;
	};

	var _getFrameCounter = function _getFrameCounter() {
		return _frameCounter;
	};
	
	var _getCursorPosition = function _getCursorPosition() {
		return _cursor;
	};

	var _log = function _log(message, level) {
		if (level === undefined) {
			level = "info";
		}
		if (_logging && console && console.log) {
			switch (level) {
				case "debug":
					console.debug(message);
					break;
				case "info":
					console.info(message);
					break;
				case "warning":
					console.warn(message);
					break;
				case "error":
					console.error(message);
					break;
				// No default case, a default value has already been provided.
			}
		}
	};

	var _showHide = function _showHide(){
		// Refresh the variable with current state of dom
		_dom.code = document.getElementById("code");
		var stringAttribute = _dom.code.getAttribute("class");
		if (stringAttribute.indexOf('hide') !== -1) {
			var attributes = stringAttribute.split(' ');
			_dom.code.setAttribute("class", attributes[0]);
			_dom.hide.innerHTML = "Hide";
		}
		else {
			_dom.code.setAttribute("class", stringAttribute + " hide");
			_dom.hide.innerHTML = "Show";
		}
	};

	var _switchSide = function _switchSide(){
		// Refresh the variable with current state of dom
		_dom.code = document.getElementById("code");
		var stringAttribute = _dom.code.getAttribute("class");
		var attributes = stringAttribute.split(' ');
		if (stringAttribute.indexOf('bottom') !== -1) {
			attributes[0] = "left";
		}
		else {
			attributes[0] = "bottom";
		}
		if (attributes[1]) {
			_dom.code.setAttribute("class", attributes[0] + ' ' + attributes[1]);
		}
		else {
			_dom.code.setAttribute("class", attributes[0]);
		}
	};

	var _resizeCanvas = function _resizeCanvas(){
		_dom.canvas.setAttribute('width', window.innerWidth);
		_dom.canvas.setAttribute('height', window.innerHeight);
	};
	
	// Public interface
	return {
		init: function init(options) {
			return _init(options);
		},
		run: function run() {
			return _run(code);
		},
		stop: function stop() {
			return _stop();
		},
		getCanvas: function getCanvas() {
			return _getCanvas();
		},
		getCode: function getCode() {
			return _getCode();
		},
		getFramerate: function getFramerate() {
			return _getFramerate();
		},
		getFrameCounter: function getFrameCounter() {
			return _getFrameCounter();
		},
		getCursorPosition: function getCursorPosition() {
			return _getCursorPosition();
		},
		log : function log(message, level) {
			return _log(message, level);
		}
	};
};
