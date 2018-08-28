'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
	function Game() {
		_classCallCheck(this, Game);

		this.player = null;
		this.total_squiggle = 8;
		this.total_bubbles = 8;
		this.total_square = 20;
		this.total_triangle = 20;
		this.score = 0;
		this.total_objects = this.total_squiggle + this.total_bubbles + this.total_square + this.total_triangle;

		this.body_content = document.querySelectorAll('body > .sw');
		this.gameobjects = [];

		this.initBackground();
		this.initGame();
	}

	_createClass(Game, [{
		key: 'initGame',
		value: function initGame() {
			var _this = this;

			this.body_content.forEach(function (row, i) {
				setTimeout(function () {
					row.firstElementChild.classList.add('fall');
				}, i * 600);
			});
			this.start_timer = setTimeout(this.startGame.bind(this), this.body_content.length * 600);

			if (!this.ready) {
				document.body.addEventListener('keydown', function (e) {
					var kc = e.keyCode ? e.keyCode : e.which;
					if (kc == 27) {
						_this.stopGame();
						_this.finishGame();
					}
				});
				document.addEventListener("touchstart", function () {}, false);
				this.ready = true;
			}
		}
	}, {
		key: 'startGame',
		value: function startGame() {
			var _this2 = this;

			document.body.classList.add('gamemode');
			this.sortShapes();
			this.score = 0;
			this.renderScore();

			// Move enemies left & right
			var count = -15;
			var move_distance = 0.2;
			this.game_timer = setInterval(function () {
				if (count % 30 == 0) {
					move_distance *= -1;
					if (count < 300) {
						_this2.gameobjects.map(function (i) {
							return i.y += 5;
						});
					}
				}
				_this2.gameobjects.map(function (i) {
					return i.x += move_distance;
				});
				_this2.gameobjects.map(function (i) {
					return i.render();
				});
				if (_this2.gameobjects.length == 0) {
					_this2.winScreen();
				}
				count++;
			}, 150);

			this.background.classList.add('active');
			this.background.tabIndex = -1;
			this.background.focus();

			this.player = new Player();
		}
	}, {
		key: 'stopGame',
		value: function stopGame() {
			clearTimeout(this.start_timer);
			clearInterval(this.game_timer);
			this.gameobjects.map(function (o) {
				return o.destroy();
			});
			this.gameobjects = [];
			if (this.player) {
				this.player.destroy();
				delete this.player;
			}
		}
	}, {
		key: 'winScreen',
		value: function winScreen() {
			this.stopGame();
			this.win_screen = document.createElement('div');
			this.win_screen.classList.add('win-overlay');
			this.win_screen.innerHTML = '<h1>You win!</h1><h2>Score: ' + this.score + '</h2><button class=\'btn\'>Restart</button>';
			var btn = this.win_screen.querySelector('.btn');
			btn.addEventListener('click', this.finishGame.bind(this));
			btn.addEventListener('touchend', this.finishGame.bind(this));
			document.body.appendChild(this.win_screen);
		}
	}, {
		key: 'finishGame',
		value: function finishGame() {
			document.body.classList.remove('gamemode');
			document.body.removeEventListener("touchmove", this._preventScroll, false);
			if (this.win_screen) {
				this.win_screen.parentNode.removeChild(this.win_screen);
			}
			this.body_content.forEach(function (row) {
				row.firstElementChild.classList.remove('fall');
			});
			this.background.parentNode.removeChild(this.background);
			delete this.background;
			this.initBackground();
			this.initGame();
		}
	}, {
		key: 'initBackground',
		value: function initBackground() {
			var _this3 = this;

			if (!this.background) {
				this.background = document.createElement('div');
				this.background.classList.add('background');
			}
			var distance = function distance(x1, y1, x2, y2) {
				return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
			};

			var _loop = function _loop() {
				var x = Math.random() * 100;
				var y = Math.random() * 100;
				while (_this3.gameobjects.filter(function (shape) {
					return distance(shape.x, shape.y, x, y) < 10;
				}).length) {
					x = Math.random() * 100;
					y = Math.random() * 100;
					// console.count('fails')
				}
				var el = document.createElement('span');
				var shape = 'triangle';
				if (_this3.gameobjects.length < _this3.total_squiggle) {
					shape = 'squiggle';
					el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="362" height="42.125" viewBox="0 0 362 42.125"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="10px" fill-rule="evenodd" d="M25,160c10.473-19.526,21.555-33.2,32-32,14.376,1.653,19.472,32,32,32,12.873,0,19.127-32,32-32s19.127,32,32,32,19.127-32,32-32,19.127,32,32,32,19.127-32,32-32,19.127,32,32,32,19.127-32,32-32c12.527,0,17.624,30.347,32,32,10.445,1.2,21.527-12.474,32-32" transform="translate(-20 -122.938)"/></svg>';
				} else if (_this3.gameobjects.length < _this3.total_squiggle + _this3.total_bubbles) {
					shape = 'bubbles';
				} else if (_this3.gameobjects.length < _this3.total_squiggle + _this3.total_bubbles + _this3.total_square) {
					shape = 'square';
				} else {
					el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="226" height="199" viewBox="0 0 226 199"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="12px" fill-rule="evenodd" d="M21,235L128,48,235,235H21Z" transform="translate(-15 -42)"/></svg>';
				}
				el.classList.add(shape);
				el.style.transform = 'rotate(' + Math.round(Math.random() * 18) * 20 + 'deg)';
				el.classList.add('color-' + Math.min(3, Math.floor(Math.random() * 4 + 1)));
				_this3.background.appendChild(el);
				_this3.gameobjects.push(new Enemy(x, y, el, shape));
			};

			while (this.gameobjects.length < this.total_objects) {
				_loop();
			}
			document.body.insertBefore(this.background, document.body.childNodes[0]);
		}
	}, {
		key: 'renderScore',
		value: function renderScore() {
			var score = this.background.querySelector('.score');
			if (!score) {
				score = document.createElement('span');
				score.classList.add('score');
				this.background.appendChild(score);
			}
			score.innerHTML = this.score;
		}
	}, {
		key: 'sortShapes',
		value: function sortShapes() {
			var _this4 = this;

			var col_count = 0.5;
			var last_shape = void 0;
			this.gameobjects.map(function (o, i) {
				if (last_shape && last_shape != o.shape) {
					col_count = 0.5;
				}
				if (o.shape == 'squiggle') {
					o.x = col_count / _this4.total_squiggle * 100;
					o.y = 10;
				} else if (o.shape == 'bubbles') {
					o.x = col_count / _this4.total_bubbles * 100;
					o.y = 20;
				} else if (o.shape == 'square') {
					o.x = col_count / _this4.total_square * 100;
					o.y = 30;
				} else {
					o.x = col_count / _this4.total_triangle * 100;
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
		var _this5 = this;

		_classCallCheck(this, GameObject);

		this.x = x;
		this.y = y;
		this.el = element;
		this.el.style.transition = 'all .2s ease-out';
		this.el.classList.add('shape');
		this.el.classList.add(shape);
		this.shape = shape;
		// this.width = this.el.clientWidth
		this.render();
		setTimeout(function () {
			_this5.width = _this5.el.clientWidth / window.innerWidth * 100;
			if (shape == 'squiggle') {
				_this5.width /= 2;
			} else if (shape == 'bubbles') {
				_this5.width *= 3;
			}
		}, 10);
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

var Enemy = function (_GameObject) {
	_inherits(Enemy, _GameObject);

	function Enemy() {
		_classCallCheck(this, Enemy);

		return _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).apply(this, arguments));
	}

	_createClass(Enemy, [{
		key: 'destroy',
		value: function destroy() {
			_get(Enemy.prototype.__proto__ || Object.getPrototypeOf(Enemy.prototype), 'destroy', this).call(this);
			game.score++;
			game.renderScore();
		}
	}]);

	return Enemy;
}(GameObject);

var Player = function (_GameObject2) {
	_inherits(Player, _GameObject2);

	function Player() {
		_classCallCheck(this, Player);

		var _this7 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, 50, 95, document.createElement('span'), 'player'));

		_this7.moving = 0;
		_this7.el.style.transition = 'all .05s ease-out';

		_this7.background = document.querySelector('.background');
		_this7.background.appendChild(_this7.el);

		_this7.init();
		_this7.render();

		_this7.bullets = [];
		return _this7;
	}

	_createClass(Player, [{
		key: 'init',
		value: function init() {
			var _this8 = this;

			this.background.addEventListener("touchstart", this.touchMove.bind(this), false);
			this.background.addEventListener("touchmove", this.touchMove.bind(this), false);
			this.background.addEventListener("touchend", this.touchEnd.bind(this), false);
			this.background.addEventListener("keydown", this.keyDown.bind(this), false);
			this.background.addEventListener("keyup", this.keyUp.bind(this), false);
			this.timer = setInterval(function () {
				_this8.move().render();
				_this8.bullets.map(function (b) {
					return b.render();
				});
			}, 16);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), 'destroy', this).call(this);
			clearInterval(this.timer);
			this.background.removeEventListener("touchstart", this.touchMove.bind(this), false);
			this.background.removeEventListener("touchmove", this.touchMove.bind(this), false);
			this.background.removeEventListener("touchend", this.touchEnd.bind(this), false);
			this.background.removeEventListener("keydown", this.keyDown.bind(this), false);
			this.background.removeEventListener("keyup", this.keyUp.bind(this), false);
			this.bullets.map(function (b) {
				return b.destroy();
			});
			this.bullets = [];
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
			var _this9 = this;

			if (this.shoot_cooldown) {
				return;
			}
			var bullet = new Bullet(this.x, this.y);
			this.background.appendChild(bullet.el);
			this.bullets.push(bullet);
			this.shoot_cooldown = true;
			setTimeout(function () {
				_this9.shoot_cooldown = false;
			}, 69);
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
	}, {
		key: 'keyDown',
		value: function keyDown(e) {
			var kc = e.keyCode ? e.keyCode : e.which;
			if (kc == 37) {
				this.moving = -1;
				return false;
			} else if (kc == 39) {
				this.moving = 1;
				return false;
			} else if (kc == 32) {
				this.shoot();
				return false;
			}
		}
	}, {
		key: 'keyUp',
		value: function keyUp(e) {
			var kc = e.keyCode ? e.keyCode : e.which;
			if (kc == 37) {
				this.moving = 0;
			} else if (kc == 39) {
				this.moving = 0;
			}
		}
	}]);

	return Player;
}(GameObject);

var Bullet = function (_GameObject3) {
	_inherits(Bullet, _GameObject3);

	function Bullet(x, y) {
		_classCallCheck(this, Bullet);

		var _this10 = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, x, y, document.createElement('span'), 'bullet'));

		_this10.move();
		return _this10;
	}

	_createClass(Bullet, [{
		key: 'move',
		value: function move() {
			var _this11 = this;

			this.timer = setInterval(function () {
				_this11.y -= 0.5;
				if (_this11.y < 0 || _this11.checkCollisions()) {
					_this11.destroy();
				}
			}, 16);
			return this;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			_get(Bullet.prototype.__proto__ || Object.getPrototypeOf(Bullet.prototype), 'destroy', this).call(this);
			clearInterval(this.timer);
		}
	}, {
		key: 'checkCollisions',
		value: function checkCollisions() {
			var _this12 = this;

			var colliding = game.gameobjects.filter(function (o) {
				return o.x + o.width > _this12.x && o.x - o.width < _this12.x && o.y > _this12.y - 0.3 && o.y < _this12.y + 0.3;
			});
			colliding.map(function (o) {
				return o.destroy();
			});
			game.gameobjects = game.gameobjects.filter(function (o) {
				return !(o.x + o.width > _this12.x && o.x - o.width < _this12.x && o.y > _this12.y - 0.3 && o.y < _this12.y + 0.3);
			});
			return !!colliding.length;
		}
	}]);

	return Bullet;
}(GameObject);

window.game = new Game();
//# sourceMappingURL=game.js.map
