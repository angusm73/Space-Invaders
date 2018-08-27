'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
	function Game() {
		_classCallCheck(this, Game);

		this.total_squiggle = 8;
		this.total_bubbles = 8;
		this.total_square = 20;
		this.total_triangle = 20;
		this.total_objects = this.total_squiggle + this.total_bubbles + this.total_square + this.total_triangle;

		this.body_content = document.querySelectorAll('body > .sw');
		this.gameobjects = [];

		this.initBackground();
		this.initGame();

		this.player = new Player();
	}

	_createClass(Game, [{
		key: 'initGame',
		value: function initGame() {
			this.body_content.forEach(function (row, i) {
				setTimeout(function () {
					row.firstElementChild.classList.add('fall');
				}, i * 600);
			});
			setTimeout(this.startGame.bind(this), this.body_content.length * 600);
		}
	}, {
		key: 'startGame',
		value: function startGame() {
			var _this = this;

			document.body.style.overflow = 'hidden';
			this.sortShapes();

			// Move enemies left & right
			var count = -15;
			var move_distance = 0.2;
			this.game_timer = setInterval(function () {
				if (count % 30 == 0) {
					move_distance *= -1;
					if (count < 300) {
						_this.gameobjects.map(function (i) {
							return i.y += 5;
						});
					}
				}
				_this.gameobjects.map(function (i) {
					return i.x += move_distance;
				});
				_this.gameobjects.map(function (i) {
					return i.render();
				});
				count++;
			}, 150);

			document.body.addEventListener('keydown', function (e) {
				var kc = e.keyCode ? e.keyCode : e.which;
				if (kc == 27) {
					_this.stopGame();
				}
			});

			var background = document.querySelector('.background');
			background.classList.add('active');
		}
	}, {
		key: 'stopGame',
		value: function stopGame() {
			document.body.style.overflow = '';
			document.body.removeEventListener("touchmove", this._preventScroll, false);
			this.body_content.forEach(function (row) {
				row.firstElementChild.classList.remove('fall');
			});
			clearInterval(this.game_timer);
			this.gameobjects.map(function (o) {
				return o.destroy();
			});
			this.gameobjects = [];
			this.initBackground();
			var background = document.querySelector('.background');
			background.classList.remove('active');
		}
	}, {
		key: 'initBackground',
		value: function initBackground() {
			var _this2 = this;

			var background = document.createElement('div');
			var distance = function distance(x1, y1, x2, y2) {
				return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
			};
			background.classList.add('background');

			var _loop = function _loop() {
				var x = Math.random() * 100;
				var y = Math.random() * 100;
				while (_this2.gameobjects.filter(function (shape) {
					return distance(shape.x, shape.y, x, y) < 10;
				}).length) {
					x = Math.random() * 100;
					y = Math.random() * 100;
					// console.count('fails')
				}
				var el = document.createElement('span');
				var shape = 'triangle';
				if (_this2.gameobjects.length < _this2.total_squiggle) {
					shape = 'squiggle';
					el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="362" height="42.125" viewBox="0 0 362 42.125"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="10px" fill-rule="evenodd" d="M25,160c10.473-19.526,21.555-33.2,32-32,14.376,1.653,19.472,32,32,32,12.873,0,19.127-32,32-32s19.127,32,32,32,19.127-32,32-32,19.127,32,32,32,19.127-32,32-32,19.127,32,32,32,19.127-32,32-32c12.527,0,17.624,30.347,32,32,10.445,1.2,21.527-12.474,32-32" transform="translate(-20 -122.938)"/></svg>';
				} else if (_this2.gameobjects.length < _this2.total_squiggle + _this2.total_bubbles) {
					shape = 'bubbles';
				} else if (_this2.gameobjects.length < _this2.total_squiggle + _this2.total_bubbles + _this2.total_square) {
					shape = 'square';
				} else {
					el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="226" height="199" viewBox="0 0 226 199"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="12px" fill-rule="evenodd" d="M21,235L128,48,235,235H21Z" transform="translate(-15 -42)"/></svg>';
				}
				el.classList.add(shape);
				el.style.transform = 'rotate(' + Math.round(Math.random() * 18) * 20 + 'deg)';
				el.classList.add('color-' + Math.min(3, Math.floor(Math.random() * 4 + 1)));
				background.appendChild(el);
				_this2.gameobjects.push(new GameObject(x, y, el, shape));
			};

			while (this.gameobjects.length < this.total_objects) {
				_loop();
			}
			document.body.insertBefore(background, document.body.childNodes[0]);
		}
	}, {
		key: 'sortShapes',
		value: function sortShapes() {
			var _this3 = this;

			var col_count = 0.5;
			var last_shape = void 0;
			this.gameobjects.map(function (o, i) {
				if (last_shape && last_shape != o.shape) {
					col_count = 0.5;
				}
				if (o.shape == 'squiggle') {
					o.x = col_count / _this3.total_squiggle * 100;
					o.y = 10;
				} else if (o.shape == 'bubbles') {
					o.x = col_count / _this3.total_bubbles * 100;
					o.y = 20;
				} else if (o.shape == 'square') {
					o.x = col_count / _this3.total_square * 100;
					o.y = 30;
				} else {
					o.x = col_count / _this3.total_triangle * 100;
					o.y = 40;
				}
				o.render();
				col_count++;
				last_shape = o.shape;
			});
		}
	}]);

	return Game;
}();

var GameObject = function () {
	function GameObject(x, y, element, shape) {
		_classCallCheck(this, GameObject);

		this.x = x;
		this.y = y;
		this.el = element;
		this.el.style.transition = 'all .2s ease-out';
		this.el.classList.add('shape');
		this.el.classList.add(shape);
		this.shape = shape;
		this.render();
	}

	_createClass(GameObject, [{
		key: 'destroy',
		value: function destroy() {
			if (this.el.parentNode) {
				this.el.parentNode.removeChild(this.el);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			this.el.style.transform = 'translate(' + this.x + 'vw, ' + (100 - this.y) * -1 + 'vh)';
			this.el.style.webkitTransform = 'translate(' + this.x + 'vw, ' + (100 - this.y) * -1 + 'vh)';
		}
	}]);

	return GameObject;
}();

var Player = function (_GameObject) {
	_inherits(Player, _GameObject);

	function Player() {
		_classCallCheck(this, Player);

		var _this4 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, 50, 95, document.createElement('span'), 'player'));

		_this4.moving = 0;
		_this4.el.style.transition = 'all .05s ease-out';

		_this4.background = document.querySelector('.background');
		_this4.background.appendChild(_this4.el);

		_this4.init();
		_this4.render();

		_this4.bullets = [];
		return _this4;
	}

	_createClass(Player, [{
		key: 'init',
		value: function init() {
			var _this5 = this;

			this.background.addEventListener("touchstart", this.touchMove.bind(this), false);
			this.background.addEventListener("touchmove", this.touchMove.bind(this), false);
			this.background.addEventListener("touchend", this.touchEnd.bind(this), false);
			document.body.addEventListener('keydown', function (e) {
				var kc = e.keyCode ? e.keyCode : e.which;
				if (kc == 37) {
					_this5.moving = -1;
					return false;
				} else if (kc == 39) {
					_this5.moving = 1;
					return false;
				} else if (kc == 32) {
					_this5.shoot();
					return false;
				}
			});
			document.body.addEventListener('keyup', function (e) {
				var kc = e.keyCode ? e.keyCode : e.which;
				if (kc == 37) {
					_this5.moving = 0;
				} else if (kc == 39) {
					_this5.moving = 0;
				}
			});
			setInterval(function () {
				_this5.move().render();
				_this5.bullets.map(function (b) {
					return b.render();
				});
			}, 16);
		}
	}, {
		key: 'move',
		value: function move() {
			if (this.move === 0) {
				return this;
			}
			this.x += this.moving * 0.5;
			if (this.x < 0) {
				this.x = 0;
			} else if (this.x > 100) {
				this.x = 100;
			}
			return this;
		}
	}, {
		key: 'shoot',
		value: function shoot() {
			var bullet = new Bullet(this.x, this.y);
			this.background.appendChild(bullet.el);
			this.bullets.push(bullet);
		}
	}, {
		key: 'touchMove',
		value: function touchMove(e) {
			for (var i = 0; i < e.targetTouches.length; i++) {
				var target = e.targetTouches[i];
				if (target.clientY < window.innerHeight * 0.8) {
					this.shoot();
				} else {
					if (target.clientX < window.innerWidth * 0.5) {
						this.moving = -1;
					} else {
						this.moving = 1;
					}
				}
			}
			e.preventDefault();
			e.stopPropagation();
		}
	}, {
		key: 'touchEnd',
		value: function touchEnd(e) {
			for (var i = 0; i < e.changedTouches.length; i++) {
				var target = e.changedTouches[i];
				if (target.clientY > window.innerHeight * 0.8) {
					this.moving = 0;
				}
			}
		}
	}]);

	return Player;
}(GameObject);

var Bullet = function (_GameObject2) {
	_inherits(Bullet, _GameObject2);

	function Bullet(x, y) {
		_classCallCheck(this, Bullet);

		var _this6 = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, x, y, document.createElement('span'), 'bullet'));

		_this6.move();
		return _this6;
	}

	_createClass(Bullet, [{
		key: 'move',
		value: function move() {
			var _this7 = this;

			var timer = setInterval(function () {
				_this7.y -= 0.5;
				if (_this7.y < 0 || _this7.checkCollisions()) {
					clearInterval(timer);
					_this7.destroy();
				}
			}, 16);
			return this;
		}
	}, {
		key: 'checkCollisions',
		value: function checkCollisions() {
			var _this8 = this;

			var colliding = game.gameobjects.filter(function (o) {
				return o.x > _this8.x - 1 && o.x < _this8.x + 1 && o.y > _this8.y - 0.5 && o.y < _this8.y + 0.5;
			});
			colliding.map(function (o) {
				return o.destroy();
			});
			game.gameobjects = game.gameobjects.filter(function (o) {
				return !(o.x > _this8.x - 1 && o.x < _this8.x + 1 && o.y > _this8.y - 0.5 && o.y < _this8.y + 0.5);
			});
		}
	}]);

	return Bullet;
}(GameObject);

window.game = new Game();
//# sourceMappingURL=game.js.map
