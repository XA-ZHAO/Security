/**
<<<<<<< HEAD
 * 公共类
 * @param {Object} window 全局win
 */
(function(window) {
	
	/**
	 * 服务地址 
	 */
	var host = "http://10.0.6.82:8888"
	/**
	 * 数据路径 
	 */
	var dbpath = ''
	
	var c = {}
	/**
	 * 数据库操作模块
	 */
	c.dbHelper = {
		init : function() {
			alert('test')
		},
		select : function() {
		}
	}
	/**
	 * 网络请求模块
	 */
	c.httpHelper = {
		ajax : function(requestDatas,success,fail) {
			var params = {
				url : host,
				method : 'post',
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				data : {
					values : {
						request : requestDatas
					}
				}
			};
			api.ajax(params, function(ret, err) {
				if (ret && typeof ret != 'undefined') {
					if (ret.state == 1) {
						//成功
						console.log("访问成功：" + JSON.stringify(ret));
						success(ret);
					} else {
						//失败
						console.log("接口错误：" + JSON.stringify(ret));
						fail(ret.msg);
					}
				} else if (ret == null) {
					console.log("接口错误：" + JSON.stringify(ret));
					//fail(JSON.stringify(ret));
				} else {
					//失败
					console.log("系统错误：" + JSON.stringify(err));
					//fail(err.msg);
				}
			});
		}
	}
	/**
	 * 公共类
	 */
	window.$common = c

=======
 * 公共类 
 * @param {Object} window 全局win
 */
(function(window){
	
	var c = {}
	/**
	 * 数据库操作模块 
	 */
	c.dbHelper = {
		init:function(){
			alert('test')
		},
		select:function(){}
		
	}
	/**
	 * 网络请求模块 
	 */
	c.httpHelper = {
	}
	/**
	 * 公共类 
	 */
	window.$common = c
	
>>>>>>> 9a21e0230cae906bd0506ef701ffe619793fcb7a
})(window)