//时间戳
var timestamp = "";
//密钥
var secretKey = "njfrolj343lkjjouer652";

var host = "http://10.0.6.82:8089/webapp";

var url = host+"/test.do";
//图片上传服务路径
var uploadUrl = host+"/multipart.do";
/**
 * 请求网络
 * @param {Object} method 方法名
 * @param {Object} request 传入json数据
 * @param {Object} success 成功回调函数
 * @param {Object} fail 失败回调函数
 * @param {Object} notShowProgress 是否显示等待,默认显示
 */
function webRequest(method, request, isshowprogress, success, fail) {
	if (isshowprogress)
		api.showProgress({
			style : 'default',
			animationType : 'fade',
			title : '努力加载中...',
			text : '先喝杯茶...',
			modal : true
		});
	var splits = method.split(".");
	var requestDatas = {
		appId : "A6900165846556",
		deviceid : api.deviceId,
		timestamp : new Date().getTime(),
		method : splits[1],
		service:splits[0],
		data : request
	};
	//是否有文件上传
	var files = request.files;
	//alert(files);
	if(!$base.isEmpty(files)){
		delete request["files"];
	}
	setSign(requestDatas);
	console.log("requestDatas="+JSON.stringify(requestDatas));
	var params = {
		url : url,
		method : 'post',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : {
			values : {
				data : requestDatas
			}
		}
	
	};
	if(!$base.isEmpty(files)){
		params.data["files"] = files;
		params.url = uploadUrl;
	}
	console.log("params="+JSON.stringify(params));
//	alert(JSON.stringify(params))
	api.ajax(params, function(ret, err) {
		if (ret && typeof ret != 'undefined') {
			if (ret.status == 200) {
				//成功
				console.log("访问成功：" + JSON.stringify(ret));
				success(ret);
			} else {
				//失败
				console.log("接口错误："+ JSON.stringify(ret));
				fail(ret.msg);
			}
		} else {
			//失败
			console.log("系统错误：" + JSON.stringify(err));
			fail(err.msg);
		}
		if (isshowprogress)
			api.hideProgress();
	});
}

/**
 * 批量上传json数组
 * @param {Object} method 方法名
 * @param {Object} request 传入json数据
 * @param {Object} success 成功回调函数
 * @param {Object} fail 失败回调函数
 * @param {Object} notShowProgress 是否显示等待,默认显示
 */
function webJsonsRequest(method, request, isshowprogress, success, fail) {
	var count = 0;
	var data = {
		success : [],
		fail : []
	};
	if ( typeof request.length == 'undefined' || request.length == undefined) {
		webRequest(method, request, isshowprogress, success, fail);
	} else {
		for (var i = 0; i < request.length; i++) {
			webRequest(method, request[i], isshowprogress, function(curdata) {
				count++;
				var m_data = {
					index : count,
					data : curdata
				};
				data.success.push(m_data);
				if (count == request.length) {
					success(data);
				}
			}, function(msg) {
				count++;
				var err = {
					index : count,
					data : msg
				}
				data.fail.push(err);
				if (count == request.length) {
					fail(data);
				}
			});
		}
	}
}
/**
 * 根据json给设置对应的sign签名
 * @param {Object} json 签名的json对象
 */
function setSign(obj) {
	obj.sign = getSign(obj);
}
/**
 * 根据json生成的有序的键值对字符串，生成对应的签名串
 * @param {Object} json 签名的json对象
 */
function getSign(obj) {
	var narr = [];
	if (typeof obj == 'object') {
		narr = ObjToArr(obj);
	}
	narr = xsort(narr)
	str = '';
	for (w in narr) {
		if (w == 'sign') continue;
		str += w + '=' + narr[w] + '&';
	}
	str += 'secret=' + secretKey;
	return $.md5(str);
}

/**
 * 数组排序
 * @param {Object} arr 排序的数组
 */
function xsort(arr) {
	var karr = new Array();
	var k = 0;
	for (i in arr) {
		karr[k] = i
		k++
	}

	karr.sort();
	var narr = [];
	for (n in karr) {
		if (typeof arr[karr[n]] == 'object') continue
		narr['' + karr[n]] = arr[karr[n]]
	}
	return narr;
}
/**
 * 将json对象转化成数组
 * @param {Object} arr json对象
 */
function ObjToArr(arr) {
	var narr = [];
	for (k in arr) {
		if (k == 'request') {
			for (n in arr[k]) {
				narr['' + n] = arr[k][n]
			}
		} else {
			narr['' + k] = arr[k];
		}
	}
	return narr;
}
/**
 * 上传图片
 * @param {Object} url 上传的url地址
 * @param {Object} data 上传的文件
 * @param {Object} isfinished
 * @param {Object} callback 上传成功返回地址
 */
function uploadFile(data, isfinished, callback) {
	var userid = '';
	if ( typeof $api.getStorage("user_info") != 'undefined') {
		userid = $api.getStorage("user_info").id;
	}
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '图片上传中...',
		text : '请稍等...',
		modal : true
	});
	api.ajax({
		url : uploadUrl,
		method : 'post',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : {
			files : {
				file : data
			},
			values : {
				userid : userid
			}
		}
	}, function(ret, err) {
		$base.show_c("uploadFile","ret=="+$base.jsonToStr(ret)+";err=="+$base.jsonToStr(err));
		if (ret) {
			if (ret.state == 200) {
				callback(ret);
			} else{
				alert("上传失败");
			}
		} else {
			api.alert({
				msg : ('错误码：' + err.code + '；错误信息：' + err.msg + '；网络状态码：' + err.statusCode)
			});
		}
		if (isfinished) {
			api.hideProgress();
		}
	});
}