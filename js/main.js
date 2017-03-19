$.fn.make2048=function(config){
	//定义初始CSS状态 若想改动样式只需改动此处
	var defaultconfig = {
		width:4,
		height:4,
		style:{
			background_color : 'rgb(184,175,158)',
			grid_background_color : 'rgb(204,192,178)',
			padding : 20,
			grid_size:100,
			common_style: {
				'font-family': '微软雅黑',
				'font-weight': 'bold',
				'text-align' : 'center',
				
			}
		},
		//grids的数组 方便修改 复用性强
		grids:[
			{level: 0, value: 2, style:{ 'background-color': 'rgb(238,228,218)', 'color': 'black', 'font-size': 58}},
			{level: 1, value: 4, style:{ 'background-color': 'rgb(238,224,200)', 'color': 'rgb(124,115,106)', 'font-size': 58}},
			{level: 2, value: 8, style:{ 'background-color': 'rgb(242,177,121)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 3, value: 16, style:{ 'background-color': 'rgb(245,149,99)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 4, value: 32, style:{ 'background-color': 'rgb(237,93,59)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 5, value: 64, style:{ 'background-color': 'rgb(236,206,112)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 6, value: 128, style:{ 'background-color': 'rgb(237,204,97)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 7, value: 256, style:{ 'background-color': 'rgb(236,200,80)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 8, value: 512, style:{ 'background-color': 'rgb(237,197,63)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 9, value: 1024, style:{ 'background-color': 'rgb(238,194,46)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 10, value: 2048, style:{ 'background-color': 'rgb(61,58,51)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
			{level: 11, value: 4096, style:{ 'background-color': 'rgb(61,58,51)', 'color': 'rgb(255,247,235)', 'font-size': 58}},
		],
		animate_speed:300,
		doAnimation : false
	}
	//state存格子中的值,存放的位置是getindex获取
	var state=[];
	//$.extend这个方法中，config是可以传入的值，如果未传值 则取defaultconfig中的值。如果传入，重复的会覆盖，不重复就叠加
	config = $.extend({},defaultconfig,config);
	if(this.length > 1) throw '只可以开始一个游戏';
	if(this.length == 0) throw '未找到游戏容器';
	//JQ对象加入$符合进行分辨！this为html中#game的DIV
	var $this = $(this[0]);

	$this.css({
		'background-color' : config.style.background_color,
		'border-radius' : config.style.padding,
		'position' : 'relative',
		'-webkit-user-user' : 'none'
	})

	//获取每格位置
	var getPosition = function(x,y){
		return {
			'left' : config.style.padding + x * (config.style.grid_size + config.style.padding), 
			'top' : config.style.padding + y * (config.style.grid_size + config.style.padding)
		}	
	}

	//获取空格子,返回 空格的INDEX 数组
	var getEmptyGridIndexs = function(){
		var emptyGridIndexs = [];
		//JQ each index在前 OBJ在后 ，map相反
		$(state).each(function(i,o){
			if(o == null){
				emptyGridIndexs.push(i)
			}
		})
		return emptyGridIndexs;
	}
	//通过x,y获取index
	var getIndex = function(x,y){
		return config.width * y + x;
	}


	//通过EmptyGridIndexs INDEX获取坐标
	var getCoordinate=function(index){
		return {
			x : index % config.width,
			y : Math.floor(index / config.width)
		}
	}
	var getGrid = function(x,y){
		return state[getIndex(x,y)];
	}
	//创建背景格
	var createBgGrid = function(){
		var backgrounds=[];
		for(var x=0;x<config.width;x++){
			for(var y=0;y<config.height;y++){
				state.push(null);
				var bg_grid = $('<div></div>');
				var position = getPosition(x,y);
				bg_grid.css({
					'width' : config.style.grid_size,
					'height' : config.style.grid_size,
					'background-color' : config.style.grid_background_color,
					'position' : 'absolute',
					'left' : position.left,
					'top' : position.top,
				});
				backgrounds.push(bg_grid);
			}
		}
		for(var i in backgrounds){
			$this.append(backgrounds[i]);
		}
		$this.width((config.style.grid_size+config.style.padding)*config.width+config.style.padding);
		$this.height((config.style.grid_size+config.style.padding)*config.height+config.style.padding);

	}
	//创建数字格
	var createNumGrid = function(level,x,y){
		var emptyGridIndexs = getEmptyGridIndexs();
		if(emptyGridIndexs.length == 0) return false;
		if(level > 11 || x > 3 || y > 3) throw 'level or x or y out of the range'


		//随机初始数字
		var grid ;
		if(level != undefined){
			grid = $.extend({},config.grids[level])
		}else{
			grid = $.extend({},Math.random() >= 0.5 ? config.grids[0] : config.grids[1])
		}

		//随机位置
		var gridIndex;
		if(x != undefined && y!= undefined){
			gridIndex = getIndex(x,y);
		}else{
			gridIndex = emptyGridIndexs[Math.floor(Math.random() * emptyGridIndexs.length)];
		}

		
		
		var coordinate = getCoordinate(gridIndex);
		var position = getPosition(coordinate.x , coordinate.y);
		//数字格
		var num_grid = $('<div></div>');
		num_grid.addClass('grid_' + coordinate.x + '_' + coordinate.y);
		num_grid.css($.extend(config.style.common_style, {
			'position': 'absolute',
			'top': position.top + config.style.grid_size/2,
			'left': position.left + config.style.grid_size/2,
			'width': 0,
			'height': 0
		},  grid.style))

		$this.append(num_grid);
		state[gridIndex] = grid;
		num_grid.animate({
			'width': config.style.grid_size,
			'height': config.style.grid_size,
			'top': position.top,
			'left': position.left,
			'line-height' : config.style.grid_size + 'px'//勿忘PX.否则line-height太大。
		},config.animate_speed, (function(num_grid){
			//利用闭包使下面这个函数里的内容在动画结束后执行，如果不是闭包的话就会同步
			return function(){
				num_grid.text(grid.value);
			}
		})(num_grid));

		if(emptyGridIndexs.length == 1){
			var canmove = false;
			for(var x=0 ; x<config.width && !canmove ; x++){
				for(var y=0 ; y<config.height && !canmove ; y++){
					if(x > 0 && state[getIndex(x-1,y)].value == state[getIndex(x,y)].value){
						canmove = true;
					}
					if(x < config.width-1 && state[getIndex(x+1,y)].value == state[getIndex(x,y)].value){
						canmove = true;
					}
					if(y > 0 && state[getIndex(x,y-1)].value == state[getIndex(x,y)].value){
						canmove = true;

					}
					if(y < config.width-1 && state[getIndex(x,y+1)].value == state[getIndex(x,y)].value){
						canmove = true;
					}
				}
			}

			if(!canmove){
				gameEnd();
				return false;
			}
		}
		
		return true;
	}

	var oldTime = 0;//时间戳，防止动画未结束就开始下一步
	var move = function(direction){
		var startX,startY,endX,endY,moveX,moveY,doAnimation;
		var plus =[];
		var d = new Date();
		var time = d.getTime();
		if (time - oldTime < config.animate_speed) {
			return false;
		} else { 
			oldTime = time;
		}
		switch(direction){
			case 'up':
				startX = 0 ;
				endX = config.width-1;
				startY = 1;
				endY = config.height-1;
				moveX = 0 ;
				moveY = -1 ;
				doAnimation = false;
				break;
			case 'down':
				startX = 0 ;
				endX = config.width-1;
				startY = config.height-2;
				endY = 0;
				moveX = 0 ;
				moveY = 1 ;
				doAnimation = false;
				break;
			case 'right':
				startX = config.width-2 ;
				endX = 0;
				startY = 0;
				endY = config.height-1;
				moveX = 1 ;
				moveY = 0 ;
				doAnimation = false;
				break;
			case 'left':
				startX = 1 ;
				endX = config.width-1 ;
				startY = 0 ;
				endY = config.height-1;
				moveX = -1 ;
				moveY = 0 ;
				doAnimation = false;

				break;	
		}
			for(var x=startX ; x >= Math.min(startX,endX) && x <= Math.max(startX,endX) ; startX > endX ? x-- : x++){	
				for(var y=startY ; y >= Math.min(startY,endY) && y <= Math.max(startY,endY) ; startY > endY ? y-- : y++){
					var gridDom = $('.grid_' + x + '_' + y);
					var grid = getGrid(x,y);
					if(grid == null) continue;
					var target_coordinate = {x:x + moveX , y:y + moveY};
					var target_grid = getGrid(target_coordinate.x,target_coordinate.y);
					var moved = 0;
					if(startX == 0 ){
						if(startY > endY){
							//down
							while(target_coordinate.y < config.height-1 && target_grid == null){
								target_coordinate.y = target_coordinate.y + 1;
								target_grid = getGrid(target_coordinate.x,target_coordinate.y);
								if(++moved > Math.max(config.width,config.height)) break;
							}
						}else{
							//up
							while(target_coordinate.y > 0 && target_grid == null){
								target_coordinate.y = target_coordinate.y - 1;
								target_grid = getGrid(target_coordinate.x,target_coordinate.y);
								if(++moved > Math.max(config.width,config.height)) break;
							}
						}
					}else{
						if(startX > endX){
							//right
							while(target_coordinate.x < config.width-1 && target_grid == null){
								target_coordinate.x = target_coordinate.x + 1;
								target_grid = getGrid(target_coordinate.x,target_coordinate.y);
								if(++moved > Math.max(config.width,config.height)) break;
							}

						}else{
							//left
							while(target_coordinate.x > 0 && target_grid == null){
								target_coordinate.x = target_coordinate.x - 1;
								target_grid = getGrid(target_coordinate.x,target_coordinate.y);

								if(++moved > Math.max(config.width,config.height)) break;
							}
						}
					}
					var position = getPosition(target_coordinate.x,target_coordinate.y)
					if(target_grid == null){
						state[getIndex(x,y)] = null;
						state[getIndex(target_coordinate.x,target_coordinate.y)] = grid;
						gridDom.removeClass();
						gridDom.addClass('grid_'+target_coordinate.x+'_'+target_coordinate.y);
						gridDom.animate({
							'top':position.top,
							'left':position.left
						},config.animate_speed);
					}else if(target_grid.value == grid.value && !target_grid.justModified){
						var updateGrid = config.grids[grid.level+1];
						updateGrid.justModified = true;//判断是否移动过
						state[getIndex(x,y)] = null;
						state[getIndex(target_coordinate.x,target_coordinate.y)] = updateGrid;
						gridDom.animate({
							'top' : position.top,
							'left' : position.left
						},config.animate_speed,(function(gridDom,target_coordinate,updateGrid){
							//利用return闭包使下面这个函数里的内容在动画结束后执行，如果不是闭包的话就会同步
							return function(){
								gridDom.hide();
								var targetDom = $('.grid_'+target_coordinate.x+'_'+target_coordinate.y);
								targetDom.html(updateGrid.value);
								targetDom.css(updateGrid.style);
							}
						}(gridDom,target_coordinate,updateGrid)));
					}else if(target_grid.value != grid.value || moved >= 1){
						console.log(moved);
						if(startX == 0){
							if(startY > endY){
								//down
								target_coordinate.y = target_coordinate.y - 1;

							}else{
								//up
								target_coordinate.y = target_coordinate.y + 1;

							}
						}else{
							if(startX > endX){
								target_coordinate.x = target_coordinate.x - 1;
							}else{
								target_coordinate.x = target_coordinate.x + 1;
							}
						}
						if(target_coordinate.x == x && target_coordinate.y == y){
							continue;
						}  
						position = getPosition(target_coordinate.x,target_coordinate.y);

						state[getIndex(x,y)] = null;
						state[getIndex(target_coordinate.x,target_coordinate.y)] = grid;
						
						gridDom.removeClass();
						gridDom.addClass('grid_'+target_coordinate.x+'_'+target_coordinate.y);
						gridDom.animate({
							'top' : position.top,
							'left' : position.left
						},config.animate_speed);
					}else{
						continue;
					}
					doAnimation = true;
				}

			}
			//清空移动属性
			for(var i=0; i<state.length; i++){
				if(state[i] == null) {
					continue
				}else if(state[i].justModified){
					delete state[i].justModified
				}

			}
			if(doAnimation){
				createNumGrid()
			}
	}
	var keyboard_move = function(evt){
		switch(evt.which){
			case 38:
				move('up');				
				break;
			case 40 :
				move('down');
				break;
			case 39 :
				move('right');
				break;
			case 37 :
				move('left');
				break;

		}
	}

	var startGame = function(){
		$this.html('');
		state = [];
		createBgGrid();
		
		createNumGrid();
		createNumGrid();

		//结束测试
		// createNumGrid(1,0,0);
		// createNumGrid(2,0,1);
		// createNumGrid(3,0,2);
		// createNumGrid(4,0,3);

		// createNumGrid(5,1,0);
		// createNumGrid(6,1,2);
		// createNumGrid(7,1,3);

		// createNumGrid(1,2,0);
		// createNumGrid(2,2,1);
		// createNumGrid(3,2,2);
		// createNumGrid(4,2,3);

		// createNumGrid(5,3,0);
		// createNumGrid(6,3,1);
		// createNumGrid(7,3,2);
		// createNumGrid(8,3,3);
		
		$('html').on('keydown',keyboard_move);
	}

	var gameEnd = function(){
		$('html').off('keyboard_move',keyboard_move);
		var result = 0;
		for(var i=0 ; i<state.length ; i++){
			result += state[i].value;
		}
		var $mask = $('<div></div>')


		var $win = $('<div></div>');
		var $score = $('<p></p>');
		var $btn = $('<button></button>');
		$mask.css({
			'position':'absolute',
			'left' : 0,
			'top' : 0,
			'width' : '100%',
			'height' : '100%',
			'background-color' : 'rgba(192,192,192,0.8)',
		})
		$win.css({
			'position' : 'absolute',
			'top' : '20%',
			'left' :'40%',
			'width':'300px',
			'height' : '200px',
			'background-color' : config.style.background_color,
			'border-radius' : 10+'px'

		})
		$score.css({
			'width' : '200px',
			'height': '50px',
			'position': 'absolute',
			'top' : '10%',
			'left' : '18%',
			'font-weight' : 'bold',
			'border' :'1px solid black',
			'border-radius':'5px',
			'text-align':'center',
			'line-height' : '50px'
		})
		$score.html('您的得分是 : ' + result);

		$btn.css({
			'width':'100px',
			'height':'30px',
			'text-align':'center',
			'line-height':'30px',
			'background' :'white',
			'position':'absolute',
			'left':'35%',
			'bottom':'20%'
		})
		$btn.html('重新开始游戏')
		$btn.on('click',function(evt){
			evt.preventDefault();
			startGame();
			$mask.remove()
		})

		$win.append($score);
		$win.append($btn);
		$mask.append($win);
		$('html').append($mask)
	} 
	startGame();

	
}