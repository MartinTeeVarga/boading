# boading ![Snake clone](https://img.shields.io/badge/game-%F0%9F%90%8D-DDDDDD.svg)

A playable loading screen written in Javascript. Click 'start' then press any arrow key.

[Playable demo](http://sm4.github.io/boading)

## Usage

Include the minized or non-minimized version in your HTML. Create a canvas with id `boading`. The canvas must be square, and for the best result, the dimension should be a power of 2.

There are two methods available, `boading.start()` and `boading.stop()` that are pretty self-explanatory.
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Boading demo</title>
    <link rel="stylesheet" type="text/css" href="css/basic.css">
    <script type="text/javascript" src="js/boading.js"></script>
</head>
<body>
<div class="centered">
    <div>
        <canvas width="128" height="128" id="boading"/>
    </div>
    <div style="text-align: center">
        <a href="#" onclick="boading.start(); return false;">start</a> |
        <a href="#" onclick="boading.stop(); return false;">stop</a>
    </div>
</div>
</body>
</html>
```
