
function Snake(pic_obj) {
	// 数组属性
	this.arr = [
		{row: 4, col: 4},
		{row: 4, col: 5},
		{row: 4, col: 6},
		{row: 4, col: 7},
		{row: 4, col: 8}
	];
	// 方向属性
	this.direction = 39; // left 37 top 38 right 39 bottom 40;

	this.lock = true;
	// 定义头部的图片
	this.head_pic = pic_obj.head_pic;
	// 定义身体图片
	this.body_pic = pic_obj.body_pic;
	// 定义尾部图片
	this.tail_pic = pic_obj.tail_pic;
	// 定义头部图片索引
	this.head_idx = 2;
	// 定义尾部图片索引
	this.tail_idx = 0;
}	
// 蛇的移动 
Snake.prototype.move = function() {
	// 创建蛇的头部
	var newHead = {

		row: this.arr[this.arr.length - 1].row,
		col: this.arr[this.arr.length - 1].col,
	}

	if (this.direction === 37) {
		// 新的头部要出现在老的头部的左边，行不变，列--
		newHead.col--;
	} else if (this.direction === 38) {
		// 新的头部要出现在老的头部的上方，列不变， 行--
		newHead.row--;
	} else if (this.direction === 39) {
		// 新的头部要出现在老的头部的右边，行不变， 列++
		newHead.col++;
	} else if (this.direction === 40) {
		// 新的头部要出现在老的头部的下方，列不变，行++
		newHead.row++;
	}

	this.arr.push(newHead);

	this.arr.shift();

	// 移动后开锁
	this.lock = true;

	// 在move之后改变尾部图片索引
	// 获取蛇的尾部
	var tail = this.arr[0];
	// 获取蛇尾部的上一个元素
	var pg = this.arr[1];

	// 判断尾部与pg之间的关系
	if (tail.row === pg.row) {
		// 说明是在同一行， 比较列的关系
		this.tail_idx = tail.col > pg.col ? 2 : 0;
	} else {
		// 说明是在同一列， 比较行的关系
		this.tail_idx = tail.row > pg.row ? 3 : 1;
	}

}
// 蛇转向
Snake.prototype.change = function(direction) {
	// 函数节流
	if (!this.lock) {
		return;
	}
	// 把锁关闭
	this.lock = false;
	
	var result = Math.abs(direction - this.direction);
	// 判断用户传递方向合法性
	if (result === 2 || result === 0) {
		// 不合法什么也不做
		return
	} else {
		// 合法,直接设置
		this.direction = direction;
	}
	// change的时候改变头部索引
	if (direction === 37) {
		this.head_idx = 0;
	} else if (direction === 38) {
		this.head_idx = 1;
	} else if (direction === 39) {
		this.head_idx = 2;
	} else {
		this.head_idx = 3;
	}
}
// 🐍吃到食物,🐍生长
Snake.prototype.growUp = function() {
	// 创建🐍的尾部
	var tail = this.arr[0];
	// 放入数组的第一项
	this.arr.unshift(tail);
}