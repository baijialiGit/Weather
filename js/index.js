$(function(){
	
	//获取城市天气图片的文档 存入tmpPic中
	var tmpPic='';
	$.ajax({
		type:'get',
		url:'http://files.heweather.com/condition-code.txt',
		dataType:'text',
		success:function(e){
			tmpPic=e;
		},
		error:function(err){
			console.log(err);
		}
	})
	
	//默认获取上海的天气信息
	getDate('上海');
	  
	
	//点击该城市切换 显示天气
	$('.cityContainer').on('click','.cityNameWhat',function(){
		//判断当前点击元素是否是否有choose类，有的话就点击无效，否则点击切换
		if($(this).parents('.cityName').hasClass('choose')){
			return
		}else{
			$(this).parents('.cityName').addClass('choose').siblings().removeClass('choose');
			var name=$(this).get(0).innerHTML;
			getDate(name);
		}	
	})
	//删除城市
	$('.cityContainer').on('click','.delete',function(){	
		//如果是最后一个城市，点击无效
		var list=[];
		$('.delete').each(function(){
			list.push($(this));
		});
		if(list.length==1){
			alert('最后一个，不能在删除');
			return
		}
		//否则删除该城市，如果该城市是当前显示城市，则默认显示第一个城市，如果不是默认显示的城市，就直接删除
		var _delete=$(this).parents('.cityName');
		var haveClass=$(this).parents('.cityName').hasClass('choose');
		if(haveClass){			
			//当删除的城市是当前显示城市时，获取最前面的城市为显示城市
			_delete.siblings().eq(0).addClass('choose');
			var cityName=_delete.siblings().eq(0).find('span').text();
			_delete.remove();
			getDate(cityName);				
		}else{
			_delete.remove();
		}			
	})
	
	
	//添加城市 如果该城市已存在，就显示提示，如果不存在就直接添加，显示该城市的天气
	$('.addBut').click(function(){		
		//获取输入框中的内容
		var value=$('.addCityName').val();
		var nameList=[];		
		//内容为空时		
		if(!value){
			alert('输入 内容不能为空！');
			return
		}else{
			//将所有的城市名称放到nameList数组中，用循环判断该城市是否存在
			$('.cityNameWhat').each(function(){
				nameList.push($(this).text());			
			})
			for(var i=0;i<nameList.length;i++){
				if(value==nameList[i]){
					alert('该城市已经存在');
					return
				}
			}
			//如果不存在就直接获取该城市
			$.ajax({
				type:'get',
				dataType:'json',
				url:"https://free-api.heweather.com/v5/search",
				data:{
					city:value,
					key:'1398bdb47da4433aa370531f221c7d48'
				},
				success:function(e){
					var data=e['HeWeather5']['0']['basic'];					
					if(!data){
						alert('输入的名称错误，请重新输入');
						return 
					}else{	
						var cityName="<div class='cityName choose clear'><span class='cityNameWhat'>"
						+value+"</span><a href='javascript:;' class='delete'>×</a></div>";
						$('.cityContainer').children('.cityName').removeClass('choose').parents('.cityContainer').append(cityName);
						getDate(value);
						
					}
				},
				error:function(err){
					console.log(err);
				}
			})
		}
	})
	
	//获取城市天气
	function getDate(city){
		$.ajax({
			cache:false,
			type:'get',
			url:'https://free-api.heweather.com/v5/forecast',
			dataType:'json',
			data:{
				city:city,
				key:'1398bdb47da4433aa370531f221c7d48'
			},
			success:function(e){
				console.log(e);
				//获取城市名称
				var nowDate=city;
				var inner=e['HeWeather5'][0]['daily_forecast'];
				//获取时间 年月日格式
				var time=e['HeWeather5'][0]['basic']['update']['loc'];	
					//匹配出年月日
				var a=/\d{0,4}-\d{0,2}-\d{0,2}/g;
				time=time.match(a)[0];//获取时间的年月日 是字符串类型	
				var list="<div class='today'><div class='dayTime'>"
					+time
					+"</div><img src='http://files.heweather.com/cond_icon/"
					+inner[0]['cond']['code_d']+".png' class='t_img'/>"
					+"<div class='t_tmp'><p class='t_mintmp'>"+inner[0]['tmp']['min']
					+"</p><p class='t_content'>-</p><p class='t_maxtmp'><span>"
					+inner[0]['tmp']['max']
					+"</span><span class='t_unit1'>。</span><span class='t_unit2'>c</span></p></div>"
					+"<div class='t_txt'><span>"
					+inner[0]['cond']['txt_d']
					+"</span><span>转</span><span>"
					+inner[0]['cond']['txt_n']
					+"</span></div><div class='t_wind'>"
					+inner[0]['wind']['dir']+"</div></div>"
					/*上面是第一天*/
					+"<div class='today second'><div class='dayTime'>"
					+inner[1]['date']
					+"</div><img src='http://files.heweather.com/cond_icon/"+inner[1]['cond']['code_d']+".png' class='t_img'/><div class='t_tmp'><p class='t_mintmp'>"
					+inner[1]['tmp']['min']
					+"</p><p class='t_content'>-</p><p class='t_maxtmp'><span>"
					+inner[1]['tmp']['max']
					+"</span><span class='t_unit1'>。</span><span class='t_unit2'>c</span></p></div>"
					+"<div class='t_txt'><span>"
					+inner[1]['cond']['txt_d']
					+"</span><span>转</span><span>"
					+inner[1]['cond']['txt_n']
					+"</span></div><div class='t_wind'>"
					+inner[1]['wind']['dir']
					+"</div></div>"
					/*第二天*/
					+"<div class='today'><div class='dayTime'>"
					+inner[2]['date']+
					"</div><img src='http://files.heweather.com/cond_icon/"+inner[2]['cond']['code_d']+".png' class='t_img'/><div class='t_tmp'><p class='t_mintmp'>"+inner[2]['tmp']['min']
					+"</p><p class='t_content'>-</p><p class='t_maxtmp'><span>"+inner[2]['tmp']['max']+"</span><span class='t_unit1'>。</span><span class='t_unit2'>c</span></p></div>"
					+"<div class='t_txt'><span>"+inner[2]['cond']['txt_d']+"</span><span>转</span><span>"+inner[2]['cond']['txt_n']+"</span></div><div class='t_wind'>"+inner[2]['wind']['dir']+"</div></div>"
					//第三天
					//将list添加到 .tmpContainer中
					$('.tmpContainer').html(list);
					$('.todayTime').html(nowDate);
			},
			error:function(err){
				console.log(err);
			}
			
		})
	}
	
	
})

