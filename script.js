// 游戏配置
const config = {
    gridSize: 20,      // 网格大小
    tileCount: 20,     // 网格数量
    initialSpeed: 150, // 初始速度（毫秒）
    speedIncrease: 5   // 每吃一个食物增加的速度
};

// 游戏状态
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameSpeed = config.initialSpeed;
let gameInterval;
let gameRunning = false;

// DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

// 初始化游戏
function initGame() {
    // 初始化蛇
    snake = [
        {x: 5, y: 10},
        {x: 4, y: 10},
        {x: 3, y: 10}
    ];
    
    // 初始化方向
    direction = 'right';
    nextDirection = 'right';
    
    // 初始化分数
    score = 0;
    scoreElement.textContent = score;
    
    // 初始化速度
    gameSpeed = config.initialSpeed;
    
    // 生成食物
    generateFood();
}

// 生成食物
function generateFood() {
    // 随机生成食物位置，确保不在蛇身上
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * config.tileCount),
            y: Math.floor(Math.random() * config.tileCount)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#eee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        // 蛇头与身体使用不同颜色
        if (index === 0) {
            ctx.fillStyle = '#2E8B57'; // 蛇头颜色
        } else {
            ctx.fillStyle = '#3CB371'; // 蛇身颜色
        }
        
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize - 1,
            config.gridSize - 1
        );
    });
    
    // 绘制食物
    ctx.fillStyle = '#FF6347'; // 食物颜色
    ctx.fillRect(
        food.x * config.gridSize,
        food.y * config.gridSize,
        config.gridSize - 1,
        config.gridSize - 1
    );
}

// 更新游戏状态
function updateGame() {
    // 更新方向
    direction = nextDirection;
    
    // 获取蛇头
    const head = {...snake[0]};
    
    // 根据方向移动蛇头
    switch(direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    
    // 检查碰撞
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // 将新蛇头添加到蛇身前面
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score += 10;
        scoreElement.textContent = score;
        
        // 增加速度
        gameSpeed = Math.max(50, gameSpeed - config.speedIncrease);
        
        // 生成新食物
        generateFood();
    } else {
        // 如果没吃到食物，移除蛇尾
        snake.pop();
    }
}

// 检查碰撞
function checkCollision(head) {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= config.tileCount || head.y < 0 || head.y >= config.tileCount) {
        return true;
    }
    
    // 检查是否撞到自己（从第二个身体部分开始检查）
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏循环
function runGameLoop() {
    updateGame();
    drawGame();
}

// 开始游戏
function startGame() {
    if (gameRunning) return;
    
    // 初始化游戏
    initGame();
    
    // 隐藏开始屏幕
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // 设置游戏状态
    gameRunning = true;
    
    // 启动游戏循环
    gameInterval = setInterval(runGameLoop, gameSpeed);
}

// 游戏结束
function gameOver() {
    // 停止游戏循环
    clearInterval(gameInterval);
    
    // 设置游戏状态
    gameRunning = false;
    
    // 显示游戏结束屏幕
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// 处理键盘输入
function handleKeyPress(e) {
    // 防止按键导致页面滚动
    if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    
    // 根据按键设置方向，但不允许直接反向移动
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
}

// 添加事件监听器
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);

// 初始显示开始屏幕
startScreen.classList.remove('hidden');