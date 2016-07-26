/**
 * 模块封装类
 * @param {Object} window 全局的win
 */
(function(window) {
	//全局变量
	var m = {}

	//文件操作模块
	var fs_module = {
		copyFileToFs : function(path, fs_path, fs_file_path, isNewCopy, callback){
			copyFileToFs(path, fs_path, fs_file_path, isNewCopy, callback)
		}
	}
	//加入fs文件管理模块
	m.fs = fs_module

	/**
	 * 将文件复制到fs://目录下，以便于操作
	 * @param {Object} path 当前路径
	 * @param {Object} fs_path 复制到的文件目录
	 * @param {Object} fs_file_path 复制结束的文件绝对路径
	 * @param {Object} isNewCopy 是否重新复制
	 * @param {Object} callback 回调函数
	 */
	copyFileToFs = function(path, fs_path, fs_file_path, isNewCopy, callback) {
		var fs = api.require('fs');
		fs.exist({
			path : fs_file_path
		}, function(ret, err) {
			if (!ret.exist) {
				fs.exist({
					path : fs_path
				}, function(ret, err) {
					if (ret.exist) {
						if (ret.directory) {
							fs.copyTo({
								oldPath : path,
								newPath : fs_path
							}, function(ret, err) {
								console.log("复制成功");
								if ( typeof callback == 'function') {
									callback();
								}
							});
						}
					} else {
						fs.createDir({
							path : fs_path
						}, function(ret, err) {
							if (ret.status) {
								fs.copyTo({
									oldPath : path,
									newPath : fs_path
								}, function(ret, err) {
									console.log("复制成功");
									if ( typeof callback == 'function') {
										callback();
									}
								});
							} else {

							}
						});

					}
				});
			} else {
				console.log("文件已经存在");
				if (isNewCopy) {
					fs.remove({
						path : fs_file_path
					}, function(ret, err) {
						if (ret.status) {
							console.log("删除成功，开始重新复制");
							fs.copyTo({
								oldPath : path,
								newPath : fs_path
							}, function(ret, err) {
								console.log("复制成功");
								if ( typeof callback == 'function') {
									callback();
								}
							});
						} else {
							console.log(JSON.stringify(err));
						}
					});
				} else {
					if ( typeof callback == 'function') {
						callback();
					}
				}
			}
		});

	}
	/**
	 * 录音功能模块
	 */
	var speechRecognizer_module = {
		record : function(callback) {
			var speechRecognizer = api.require('speechRecognizer');
			speechRecognizer.record({
				vadbos : 5000,
				vadeos : 5000,
				rate : 16000,
				asrptt : 1,
				audioPath : 'fs://speechRecogniser/speech.mp3'
			}, function(ret, err) {
				if (ret.status) {
					api.alert({
						msg : ret.wordStr
					});
				} else {
					api.alert({
						msg : err.msg
					});
				}
			});
		}
	}
	/**
	 *　嵌入录音功能
	 */
	m.speechRecognizer = speechRecognizer_module
	//闹钟模块
	var alarm = null
	/**
	 * 闹钟功能模块
	 */
	var alarm_module = {
		//自定义模块
		startAlarm:function(delayTime,interval,callback){
    		//时间都是毫秒数
    		if(alarm == null)
    			alarm = api.require('alarmModule');
    		alarm.start({
    			delayTime:delayTime,
    			interval:interval
    		},function(ret){
    			if(typeof callback == 'function'){
    				callback()
    			}
    		})    	
		},
		stopAlarm:function(){
			alarm.stop(function(ret){
    			alarm.check({
    				message:ret
    			})
    		})
		}	
	}
	/**
	 * 嵌入闹钟功能
	 */
	m.alarm = alarm_module
	/**
	 * 地图模块
	 */
	var map_module = {
		/**
		 * 获取当前位置
		 */
		getLocation : function(isautoStop,callback) {
			var bMap = api.require('bMap');
			// 获取当前位置
			bMap.getLocation({
				accuracy : '10m',
				autoStop : isautoStop,
				filter : 1
			}, function(ret, err) {
				if (ret.status) {
					if ( typeof callback == 'function') {
						callback({
							lon : ret.lon,
							lat : ret.lat
						});
					}
				} else {
					if ( typeof callback == 'function') {
						callback();
					}
				}
			});
		},
		/**
		 * 打开地图
		 */
		openMap : function(rect, center, callback) {
			var bMap = api.require('bMap');
			bMap.open({
				rect : rect,
				center : center,
				zoomLevel : 10,
				showUserLocation : true,
				fixedOn : api.frameName,
				fixed : true
			}, function(ret) {
				if ( typeof callback == 'function') {
					callback(ret);
				}
			});
		},
		/**
		 * 添加标注
		 */
		addAnnotations : function(annotations) {
			var bMap = api.require('bMap');
			bMap.addAnnotations({
				annotations : annotations,
				draggable : true
			}, function(ret) {

			});

		},
		/**
		 * 设置标注信息 
		 */
		setBubble : function() {
			var map = api.require('bMap');
			map.setBubble({
				id : 2,
				bgImg : 'widget://res/bubble_bg.png',
				content : {
					title : '大标题',
					subTitle : '概述内容',
					illus : 'http://ico.ooopic.com/ajax/iconpng/?id=145044.png'
				},
				styles : {
					titleColor : '#000',
					titleSize : 16,
					subTitleColor : '#999',
					subTitleSize : 12,
					illusAlign : 'left'
				}
			}, function(ret) {
				if (ret) {
					alert(JSON.stringify(ret));
				}
			});
		}
	}
	/**
	 * 嵌入百度地图模块
	 */
	m.map = map_module

	/**
	 * 设置全局第三方模块
	 */
	window.$module = m

})(window)