/**
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
	
})(window)