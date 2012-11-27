# Canvasplay

## Description
An HTML5 <canvas> playground to fiddle with animations in an interactive way.
2012, [Jean-Karim Bockstael](jkb@jkbockstael.be)

Canvasplay is mainly a toy for myself, as I wanted to play with <canvas> animations and wanted a fun and interactive way to do so without having to switch between an editor and a browser. So here it is, an interactive playground with a few useful facilities such as logging, automatic code saving (yep, even if you close the browser), automatic framerate calculation, and automatic cancellation of pending animations.

Canvasplay is tested under Chrome and may run in other browsers that I don't care about.

## How to use

Public interface summary, use the source Luke:

```js
cp.init() // startup stuff you shouldn't have to worry about
cp.run() // runs the current code
cp.stop() // stops any current execution
cp.getCanvas() // returns the output canvas element
cp.getCode() // returns the current code
cp.getFramerate() // returns the current frame rate
cp.getFrameCounter() // returns the current frame number
cp.getCursorPosition() // returns an object with the cursor's position relative to the canvas element
cp.log(message, level) // log something to the console, level can be debug|info|warning|error
```

Enjoy!
