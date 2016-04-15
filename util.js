var class2type = {
    "[object HTMLDocument]": "Document",
    "[object HTMLCollection]": "NodeList",
    "[object StaticNodeList]": "NodeList",
    "[object DOMWindow]": "Window",
    "[object global]": "Window",
    "null": "Null",
    "NaN": "NaN",
    "undefined": "Undefined"
};
var serialize = class2type.toString,
	sopen = (window.open + '').replace(/open/g, '');

var hasOwn = Object.prototype.hasOwnProperty;

var util = {
	/*杂糅对象， 为一个对象添加更多成员
	*@param {Object} receiver 接收者
	*@param {Object} supplier 提供者
	*return {Object} 目标对象
	*/
	mix: function(receiver, supplier) {
		var args = [].slice.call(arguments),
			i = 1,
			key,
			ride = typeof args[args.length - 1] == "Boolean" ? args.pop() : true;

		while((supplier = args[i++])) {
			for(var key in supplier) {
				if(hasOwn.call(supplier, key) && (ride || !(key in receiver))){
					receiver[key] = supplier[key];
				}
			}
		}
		return receiver;
	},
	/**
    * 用于取得数据的类型（一个参数的情况下）或判定数据的类型（两个参数的情况下）
    * @param {Any} obj 要检测的东西
    * @param {String} str ? 要比较的类型
    * @return {String|Boolean}
    */
	type: function(obj, str) {
		var result = class2type[(obj == null || obj !== obj) ? obj : serialize.call(obj)] || obj.nodeName || "#";
        if (result.charAt(0) === "#") { //兼容旧式浏览器与处理个别情况,如window.opera
            if (obj.nodeType === 9) {
                result = "Document"; //返回构造器名字
            } else if (obj.callee) {
                result = "Arguments"; //返回构造器名字
            } else if (isFinite(obj.length) && obj.item) {
                result = "NodeList"; //处理节点集合
            } else {
                result = serialize.call(obj).slice(8, -1);
            }
        }
        if (str) {
            return str === result;
        }
        return result;
	},
	/*判断一个对象是否是纯对象（object或JSON）,而非DOM或者js原生对象
	*@param {Object} obj
	* return {Boolean}
	*/
	isPlainObject: function (obj) {
		if(!util.type(obj, "Object") || util.isNative("reload", obj)){
			return false;
		}
		for(var key in obj){
			if(!Object.prototype.hasOwnProperty.call(obj, key)){//如果存在一个方法来自自己的原型立即返回
				return false
			}
		}
		return true;
	},
	/*
	*判定一个method是否为obj的原生方法
	*@param {Function} method
	*@param {object} obj
	*return {Boolean}
	*/
	isNative: function (method, obj) {
		var m = obj ? obj[method] : false,
			r = new RegExp(method, 'g');
		return !!(m && m != "string" && sopen === (m + '').replace(r, ''));
	},

	/*
	*判断一个对象是否为空对象
	*@param {Object} obj
	*return {Boolean}
	*/
	isEmptyObject: function (obj) {
		for(var i in obj){
			return false
		}
		return true;
	},

	isFunction: function(fn) {
		return "[object Function]" === util.toString.call(fn);
	},

	isArray: function(arr) {
		return "[object Array]" === util.toString.call(arr);
	},

	/*
	*处理传入的键值对，将其放入到fn函数里进行处理并且通过map控制是否将其返回
	*@param {Object} obj
	*@param {Function} fn
	*@param {Boolean} map
	*return {Object}
	*/
	each: function(obj, fn, map) {
        var value, i = 0,
                isArray = util.isArray(obj),
                ret = [];
        if (isArray) {
            for (var n = obj.length; i < n; i++) {
                value = fn.call(obj[i], i, obj[i]);
                if (map) {
                    if (value != null) {
                        ret[ ret.length ] = value;
                    }
                } else if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = fn.call(obj[i], i, obj[i]);
                if (map) {
                    if (value != null) {
                        ret[ ret.length ] = value;
                    }
                } else if (value === false) {
                    break;
                }
            }
        }
        return map ? ret : obj;
    },

    map: function(obj, fn) {
    	return util.each(obj, fn, true);
    },
    /*过滤数组中不符合要求的元素
    *@param {Object} obj
    *@param {Function} fn
    *return {Object}
    */
    filter: function(obj, fn) {
    	for(var i = 0, n < obj.length, ret = []; i < n; i++) {
    		var val = fn.call(obj[i], obj[i], i);
    		if(!!val){
    			ret[ret.length - 1] = obj[i];
    		}
    	}
    	return ret;
    }
}

"String,Array,Number,Object".replace(/[^, ]+/g, function(Type){
})


// window.util = util;