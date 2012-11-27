/* Canvasplay -  An HTML5 <canvas> playground to fiddle with animations in an interactive way.
 * 2012, Jean-Karim Bockstael <jkb@jkbockstael.be>
 */
var canvasPlay = function(options) {
	// Private variables
	var _dom = {
		canvas: undefined,
		code: undefined,
		run: undefined,
		stop: undefined,
		framerate: undefined,
		showHideButton: undefined
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
	var _init = function(options) {
		_dom.canvas = document.getElementById(options.canvas);
		_dom.code = document.getElementById(options.code);
		_dom.run = document.getElementById(options.run);
		_dom.stop = document.getElementById(options.stop);
		_dom.framerate = document.getElementById(options.framerate);
		_dom.showHideButton = document.getElementById(options.showHideButton);
		_storedCode = localStorage.getItem("canvasplay_code");
		if (_storedCode !== undefined && _storedCode !== null) {
			_dom.code.value = _storedCode;
		}
		else {
			_dom.code.value = "Code here";
			_dom.code.onfocus = function() {
				_dom.code.value = "";
				_dom.code.onfocus = undefined;
			};
		}
		_dom.code.onkeydown = function(e) {
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
		_dom.canvas.onmousemove = function(event) {
			_cursor.x = event.layerX;
			_cursor.y = event.layerY
		};
		_dom.showHideButton.onclick = _showHide;
		_reziseCanvas();
		window.onresize = function(event){
			_reziseCanvas();
		}
	}

	// Shim for Chrome + auto-cancel + auto-framerate
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(func) { 
			// Framerate
			var thisFrame = (new Date).getTime();
			var delta = thisFrame - _lastFrame;
			_lastFrame = thisFrame;
			_framerate = Math.floor(1000 / delta);
			if (_frameCounter % 10 === 0) {
				_dom.framerate.innerHTML = "FPS: " + _framerate;
			}
			var id = window.webkitRequestAnimationFrame(func); 
			_rafMaxId = id;
			_frameCounter++;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
	}

	// Implementation for public interface
	var _run = function() {
		var code = _dom.code.value;
		_stop();
		// Store code in local storage
		localStorage.setItem("canvasplay_code", code);
		// Have fun
		eval("var canvasplayCode = function() {" + code + "\n};");
		canvasplayCode();
		_dom.stop.disabled = false;
	};

	var _stop = function() {
		// Clear any pending animation frames
		for (var i = 0, l = _rafMaxId; i <= l; i++) {
			window.cancelAnimationFrame(i);
		}
		// Reset canvas, the "yep this is a side-effect but it works" way
		_dom.canvas.width = _dom.canvas.width + 1;
		_dom.canvas.width = _dom.canvas.width - 1;
		_dom.stop.disabled = true;
	};
	
	var _getCanvas = function() {
		return _dom.canvas;
	};

	var _getCode = function() {
		return _dom.code.value;
	};

	var _getFramerate = function() {
		return _framerate;
	};

	var _getFrameCounter = function() {
		return _frameCounter;
	};
	
	var _getCursorPosition = function() {
		return _cursor;
	};

	var _log = function(message, level) {
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

	var _showHide = function(){
		if(_dom.code.getAttribute("class")=="hide"){
			_dom.code.setAttribute("class","");
		}else{
			_dom.code.setAttribute("class","hide");
		}
	}

	var _reziseCanvas = function(){
		_dom.canvas.setAttribute('width',window.innerWidth)
		_dom.canvas.setAttribute('height',window.innerHeight);
	}
	
	// Public interface
	return {
		init: function(options) {
			return _init(options);
		},
		run: function() {
			return _run(code);
		},
		stop: function() {
			return _stop();
		},
		getCanvas: function() {
			return _getCanvas();
		},
		getCode: function() {
			return _getCode();
		},
		getFramerate: function() {
			return _getFramerate();
		},
		getFrameCounter: function() {
			return _getFrameCounter();
		},
		getCursorPosition: function() {
			return _getCursorPosition();
		},
		log : function(message, level) {
			return _log(message, level);
		}
	};
};
