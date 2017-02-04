var boading = (function () {
    const left = {x: -1, y: 0};
    const right = {x: 1, y: 0};
    const up = {x: 0, y: -1};
    const down = {x: 0, y: 1};
    const keyMap = {
        37: left,
        38: up,
        39: right,
        40: down
    };
    const STEP = 125;
    const rgb = "32, 32, 46";
    const max = {x: 16, y: 16};
    const cpuBounds = {minx: 6, maxx: 9, miny: 6, maxy: 9};

    var requestId, boa, food, canvas, context, drive;

    var last = new Date().getMilliseconds();
    var elapsed = 0;

    var size = 8;
    var grow = false;
    var direction = right;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function resetBoa() {
        food = undefined;
        direction = right;
        boa = [{x: 9, y: 6}, {x: 8, y: 6}, {x: 7, y: 6}, {x: 6, y: 6}, {x: 6, y: 7}, {x: 6, y: 8}, {x: 6, y: 9}];
    }

    function addFood() {
        food = {
            x: getRandomInt(0, max.x - 1),
            y: getRandomInt(0, max.y - 1)
        };
        while (checkBodyCollision(food.x, food.y)) {
            addFood();
        }
    }

    function driveCpu(head, direction) {
        if (head.x >= cpuBounds.maxx && direction == right) {
            return down;
        } else if (head.y >= cpuBounds.maxx && direction == down) {
            return left;
        } else if (head.x <= cpuBounds.minx && direction == left) {
            return up;
        } else if (head.y <= cpuBounds.minx && direction == up) {
            return right;
        } else {
            return direction;
        }
    }

    function checkBodyCollision(x, y) {
        for (var i = 0; i < boa.length; i++) {
            if (x == boa[i].x && y == boa[i].y) {
                return true;
            }
        }
        return false;
    }

    function driveHooman(head, direction) {
        var next = {
            x: head.x + direction.x,
            y: head.y + direction.y
        };
        if (next.x > max.x || next.x < 0 || next.y > max.y || next.y < 0 || checkBodyCollision(next.x, next.y)) {
            return undefined;
        }
        if (checkBodyCollision(food.x, food.y)) {
            grow = true;
        }

        return direction;
    }

    function drawSquare(x, y, a) {
        context.beginPath();
        context.fillStyle = "rgba(" + rgb + ", " + a + ")";
        context.fillRect(x * size, y * size, size - 1, size - 1);
        context.closePath();
    }

    function update(delta) {
        elapsed += delta;
        while (elapsed >= STEP) {
            var head = boa[0];
            direction = drive(head, direction);
            if (direction) {
                if (!grow) {
                    boa.pop();
                } else {
                    grow = false;
                    addFood();
                }
                var newHead = {x: head.x + direction.x, y: head.y + direction.y};
                boa.unshift(newHead);
            } else {
                drive = driveCpu;
                resetBoa();
            }
            elapsed -= STEP;
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (drive == driveHooman) {
            context.beginPath();
            context.strokeStyle = "rgba(" + rgb + ", 0.5)";
            context.rect(0, 0, canvas.width, canvas.height);
            context.stroke();
        }
        for (var i = 0; i < boa.length; i++) {
            var a = drive == driveCpu ? 1 - (i / boa.length) : 1;
            drawSquare(boa[i].x, boa[i].y, a);
        }
        if (food) {
            drawSquare(food.x, food.y, 0.5);
        }
    }

    function loop(timestamp) {
        update(timestamp - last);
        draw();

        last = timestamp;
        requestId = window.requestAnimationFrame(loop)
    }

    function isReverse(prev, next) {
        return prev.x + next.x == 0 && prev.y + prev.y == 0;
    }

    var loopStart = function () {
        resetBoa();
        drive = driveCpu;
        canvas = document.getElementById('boading');
        size = canvas.width / 16;
        context = canvas.getContext('2d');

        if (!requestId) {
            requestId = window.requestAnimationFrame(loop);
            window.onkeydown = function (event) {
                if (drive == driveCpu) {
                    drive = driveHooman;
                    addFood();
                } else {
                    var newDirection = keyMap[event.keyCode];
                    if (newDirection && !isReverse(newDirection, direction)) {
                        direction = newDirection;
                    }
                }
            };
        }
    };

    var loopStop = function() {
        if (requestId) {
            window.cancelAnimationFrame(requestId);
            requestId = undefined;
            window.onkeydown = null;
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return {
        start: loopStart,
        stop: loopStop
    };
})();
