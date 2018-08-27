class Game {

	constructor() {
		this.total_squiggle = 8
		this.total_bubbles = 8
		this.total_square = 20
		this.total_triangle = 20
		this.total_objects = this.total_squiggle + this.total_bubbles + this.total_square + this.total_triangle

		this.body_content = document.querySelectorAll('body > .sw')
		this.gameobjects = []

		this.initBackground()
		this.initGame()

		this.player = new Player()
	}

	initGame() {
		this.body_content.forEach((row, i) => {
			setTimeout(() => {
				row.firstElementChild.classList.add('fall')
			}, i * 600)
		})
		setTimeout(this.startGame.bind(this), this.body_content.length * 600)
	}

	startGame() {
		document.body.style.overflow = 'hidden'
		this.sortShapes()

		// Move enemies left & right
		let count = -15
		let move_distance = 0.2
		this.game_timer = setInterval(() => {
			if (count % 30 == 0) {
				move_distance *= -1
				if (count < 300) {
					this.gameobjects.map(i => i.y += 5)
				}
			}
			this.gameobjects.map(i => i.x += move_distance)
			this.gameobjects.map(i => i.render())
			count++
		}, 150)

		document.body.addEventListener('keydown', e => {
			let kc = e.keyCode ? e.keyCode : e.which
			if (kc == 27) {
				this.stopGame()
			}
		})

		let background = document.querySelector('.background')
		background.classList.add('active')
	}

	stopGame() {
		document.body.style.overflow = ''
		document.body.removeEventListener("touchmove", this._preventScroll, false);
		this.body_content.forEach(row => {
			row.firstElementChild.classList.remove('fall')
		})
		clearInterval(this.game_timer)
		this.gameobjects.map(o => o.destroy())
		this.gameobjects = []
		this.initBackground()
		let background = document.querySelector('.background')
		background.classList.remove('active')
	}

	initBackground() {
		let background = document.createElement('div')
		let distance = (x1, y1, x2, y2) => {
			return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
		}
		background.classList.add('background')
		while (this.gameobjects.length < this.total_objects) {
			let x = Math.random() * 100
			let y = Math.random() * 100
			while (this.gameobjects.filter(shape => distance(shape.x, shape.y, x, y) < 10).length) {
				x = Math.random() * 100
				y = Math.random() * 100
				// console.count('fails')
			}
			let el = document.createElement('span')
			let shape = 'triangle'
			if (this.gameobjects.length < this.total_squiggle) {
				shape = 'squiggle'
				el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="362" height="42.125" viewBox="0 0 362 42.125"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="10px" fill-rule="evenodd" d="M25,160c10.473-19.526,21.555-33.2,32-32,14.376,1.653,19.472,32,32,32,12.873,0,19.127-32,32-32s19.127,32,32,32,19.127-32,32-32,19.127,32,32,32,19.127-32,32-32,19.127,32,32,32,19.127-32,32-32c12.527,0,17.624,30.347,32,32,10.445,1.2,21.527-12.474,32-32" transform="translate(-20 -122.938)"/></svg>'
			} else if (this.gameobjects.length < this.total_squiggle + this.total_bubbles) {
				shape = 'bubbles'
			} else if (this.gameobjects.length < this.total_squiggle + this.total_bubbles + this.total_square) {
				shape = 'square'
			} else {
				el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="226" height="199" viewBox="0 0 226 199"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="12px" fill-rule="evenodd" d="M21,235L128,48,235,235H21Z" transform="translate(-15 -42)"/></svg>'
			}
			el.classList.add(shape)
			el.style.transform = 'rotate(' + (Math.round(Math.random() * 18) * 20) + 'deg)'
			el.classList.add('color-' + Math.min(3, Math.floor(Math.random() * 4 + 1)))
			background.appendChild(el)
			this.gameobjects.push(new GameObject(x, y, el, shape))
		}
		document.body.insertBefore(background, document.body.childNodes[0])
	}

	sortShapes() {
		let col_count = 0.5
		let last_shape
		this.gameobjects.map((o, i) => {
			if (last_shape && last_shape != o.shape) {
				col_count = 0.5
			}
			if (o.shape == 'squiggle') {
				o.x = col_count / this.total_squiggle * 100
				o.y = 10
			} else if (o.shape == 'bubbles') {
				o.x = col_count / this.total_bubbles * 100
				o.y = 20
			} else if (o.shape == 'square') {
				o.x = col_count / this.total_square * 100
				o.y = 30
			} else {
				o.x = col_count / this.total_triangle * 100
				o.y = 40
			}
			o.render()
			col_count++
			last_shape = o.shape
		})
	}
}

class GameObject {
	constructor(x, y, element, shape) {
		this.x = x
		this.y = y
		this.el = element
		this.el.style.transition = 'all .2s ease-out'
		this.el.classList.add('shape')
		this.el.classList.add(shape)
		this.shape = shape
		this.render()
	}
	destroy() {
		if (this.el.parentNode) {
			this.el.parentNode.removeChild(this.el)
		}
	}
	render() {
		this.el.style.transform = `translate(${this.x}vw, ${(100 - this.y) * -1}vh)`
		this.el.style.webkitTransform = `translate(${this.x}vw, ${(100 - this.y) * -1}vh)`
	}
}

class Player extends GameObject {
	constructor() {
		super(50, 95, document.createElement('span'), 'player')
		this.moving = 0
		this.el.style.transition = 'all .05s ease-out'

		this.background = document.querySelector('.background')
		this.background.appendChild(this.el)

		this.init()
		this.render()

		this.bullets = []
	}
	init() {
		this.background.addEventListener("touchstart", this.touchMove.bind(this), false)
		this.background.addEventListener("touchmove", this.touchMove.bind(this), false)
		this.background.addEventListener("touchend", this.touchEnd.bind(this), false)
		document.body.addEventListener('keydown', e => {
			let kc = e.keyCode ? e.keyCode : e.which
			if (kc == 37) {
				this.moving = -1
				return false
			} else if (kc == 39) {
				this.moving = 1
				return false
			} else if (kc == 32) {
				this.shoot()
				return false
			}
		})
		document.body.addEventListener('keyup', e => {
			let kc = e.keyCode ? e.keyCode : e.which
			if (kc == 37) {
				this.moving = 0
			} else if (kc == 39) {
				this.moving = 0
			}
		})
		setInterval(() => {
			this.move().render()
			this.bullets.map(b => b.render())
		}, 16)
	}
	move() {
		if (this.move === 0) {
			return this
		}
		this.x += this.moving * 0.5
		if (this.x < 0) {
			this.x = 0
		} else if (this.x > 100) {
			this.x = 100
		}
		return this
	}
	shoot() {
		let bullet = new Bullet(this.x, this.y)
		this.background.appendChild(bullet.el)
		this.bullets.push(bullet)
	}
	touchMove(e) {
		for (let i = 0; i < e.targetTouches.length; i++) {
			const target = e.targetTouches[i]
			if (target.clientY < window.innerHeight * 0.8) {
				this.shoot()
			} else {
				if (target.clientX < window.innerWidth * 0.5) {
					this.moving = -1
				} else {
					this.moving = 1
				}
			}
		}
		e.preventDefault()
		e.stopPropagation()
	}
	touchEnd(e) {
		for (let i = 0; i < e.changedTouches.length; i++) {
			const target = e.changedTouches[i]
			if (target.clientY > window.innerHeight * 0.8) {
				this.moving = 0
			}
		}
	}
}

class Bullet extends GameObject {
	constructor(x, y) {
		super(x, y, document.createElement('span'), 'bullet')
		this.move()
	}
	move() {
		let timer = setInterval(() => {
			this.y -= 0.5
			if (this.y < 0 || this.checkCollisions()) {
				clearInterval(timer)
				this.destroy()
			}
		}, 16)
		return this
	}
	checkCollisions() {
		const colliding = game.gameobjects.filter(o => {
			return o.x > this.x - 1 && o.x < this.x + 1 && o.y > this.y - 0.5 && o.y < this.y + 0.5
		})
		colliding.map(o => o.destroy())
		game.gameobjects = game.gameobjects.filter(o => {
			return !(o.x > this.x - 1 && o.x < this.x + 1 && o.y > this.y - 0.5 && o.y < this.y + 0.5)
		})
	}
}

window.game = new Game
