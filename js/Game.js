/**
 * Game 整个游戏类
 * @map: 地图的实例
 * @food: 食物的实例
 * @snake: 蛇的实例
 * @block: 障碍物的实例
 ***/
function Game(map, food, snake, block) {
	
	this.map = map;
	this.food = food;
	this.snake = snake;
	this.block = block;
	this.timer = null;
	this.flag = null;

	this.init();
}
// 初始化的方法
Game.prototype.init = function() {
	this.renderMap();
	this.renderFood();
	this.renderSnake();
	this.bindEvent();
	this.start();
}

// 渲染地图
Game.prototype.renderMap = function() {
	this.map.fill();
}

// 渲染食物
Game.prototype.renderFood = function() {
	var row = this.food.row;
	var col = this.food.col;
	// 渲染食物就是在地图中渲染食物坐标元素的背景颜色
	// this.map.arr[row][col].style.backgroundColor = "red";
	this.map.arr[row][col].style.backgroundImage = "url(" + this.food.img + ")";
	this.map.arr[row][col].style.backgroundSize = "cover";

}

// 渲染蛇
Game.prototype.renderSnake = function() {
	// 获取蛇的头部
	var head = this.snake.arr[this.snake.arr.length - 1];
	this.map.arr[head.row][head.col].style.backgroundImage = "url(" + this.snake.head_pic[this.snake.head_idx] + ")";
	// 设置蛇头部的背景图片
	// 渲染蛇就是在地图中渲染蛇的每一节身体的坐标元素的背景颜色
	for (var i = 1; i < this.snake.arr.length - 1; i++) {
		// 获取蛇的每一个节身体
		var row = this.snake.arr[i].row;
		var col = this.snake.arr[i].col;

		// this.map.arr[row][col].style.backgroundColor = "orange";
		this.map.arr[row][col].style.backgroundImage = "url(" + this.snake.body_pic[0] + ")";
	}
	// 获取蛇的尾部
	var tail = this.snake.arr[0];
	this.map.arr[tail.row][tail.col].style.backgroundImage = "url(" + this.snake.tail_pic[this.snake.tail_idx] + ")";
}

// 游戏开始
Game.prototype.start = function() {

	this.flag = true;

	// 备份this
	var me = this;
	this.timer = setInterval(function() {
		// 移动
		me.snake.move();
		// 检测是否撞墙
		me.checkMap();
		// 检测是否吃到食物
		me.checkFood();
		// 检测是否撞到自己
		me.checkSnake();
		// 检测蛇是否撞到障碍物
		me.checkBlock();

		// 判断游戏是否进行
		if (me.flag) {
			// 清屏
			me.map.clear();
			// 渲染食物
			me.renderFood();
			// 渲染蛇
			me.renderSnake();
			// 渲染障碍物
			me.renderBlock();
	

		}

	}, 200) 
}

// 绑定事件
Game.prototype.bindEvent = function() {
	// 在一个类的原型方法中，不要使用除了window，document的其它全局变量
	// 备份
	var me = this;
	// 为document绑定onkeydown事件
	document.onkeydown = function(e) {
		// 获取用户按下的方向键
		var cold = e.keyCode;

		if (cold === 37 || cold === 38 || cold === 39 || cold === 40) {
			// 改变蛇的方向
			me.snake.change(cold);
		}

	}
}
// 游戏结束
Game.prototype.gameOver = function() {

	this.flag = false;
	clearInterval(this.timer);
}
// 检测是否撞墙
Game.prototype.checkMap = function() {
	// 获取🐍的头部
	var head = this.snake.arr[this.snake.arr.length - 1];
	// 与地图中的row和col进行判断
	if (head.row < 0 || head.row >= this.map.row || head.col < 0 || head.col >= this.map.col) {
		// 撞墙了
		console.log("🐍");
		// 结束游戏
		this.gameOver();
	}
}
// 检测是否吃到食物
Game.prototype.checkFood = function() {
	// 获取🐍的头部
	var head = this.snake.arr[this.snake.arr.length - 1];
	// 获取食物坐标
	var food = this.food;

	// 判断是否迟到食物
	if (head.row === food.row && head.col === food.col) {
		// eat food
		console.log("🐍吃到🎂");
		// 调用生成🐍方法
		this.snake.growUp();
		// 重置食物
		this.resetFood();
	}
}
// 重置方法,食物
Game.prototype.resetFood = function() {
	// 随机生成row和col
	var row = parseInt(Math.random() * this.map.row);
	var col = parseInt(Math.random() * this.map.col);

	// 循环检测食物与🐍的每一节身体
	for (var i = 0; i < this.snake.arr.length; i++) {
		// 获=获取🐍的每一节身体
		var one = this.snake.arr[i];

		if (one.row === row && one.col === col) {
			alert("重合了");

			this.resetFood();
			return;
		}
	}

	// 循环检测食物与障碍物的每一节身体

	for (var i = 0; i < this.block.arr.length; i++) {
		// 获取🐍的每一节身体
		var one = this.block.arr[i];

		if (one.row === row && one.col === col) {
			alert("food和障碍物重叠");

			this.resetFood();
			return;
		}
	}
	this.food.resetFood(row, col);
}
// 检测是否撞到自己
Game.prototype.checkSnake = function() {
	// 获取自己头部
	var head = this.snake.arr[this.snake.arr.length - 1];
	// 循环🐍的每一节身体进行比较
	for (var i = 0; i < this.snake.arr.length - 1; i++) {
		// 获取🐍的每一节身体
		var one = this.snake.arr[i];

		if(head.row === one.row && head.col === one.col) {
			// 自己吃到自己了
			console.log("吃到自己了");
			// game over
			this.gameOver();
		}
	}
} 
// 渲染障碍物的方法                              
Game.prototype.renderBlock = function() {
	// 渲染障碍物可以理解为渲染一条不会动的🐍
	for (var i = 0; i < this.block.arr.length; i++) {

		var row = this.block.arr[i].row;
		var col = this.block.arr[i].col;

		this.map.arr[row][col].style.backgroundImage = "url(" + this.block.img + ")";
		this.map.arr[row][col].style.backgroundSize = "cover";
	}
}
// 检测🐍是否撞到障碍物
Game.prototype.checkBlock = function() {
	// 获取🐍的头部
	var head = this.snake.arr[this.snake.arr.length - 1];
	// 循环判断是否障碍物
	for (var i = 0; i < this.block.arr.length; i++) {
		// 获取障碍物一节
		var one = this.block.arr[i];
		if (head.row === one.row && head.col === one.col) {
			this.gameOver();
		}
	}
}