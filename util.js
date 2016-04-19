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

function cloneOf(item) {
	var name = util.type(item);
	switch(name) {
		case "Array":
		case "Object":
			return util[name].clone(item);
		default:
			return item;
	}
}

function mergeOne(source, key, current) {
    //使用深拷贝方法将多个对象或数组合并成一个
    if (util.isPlainObject(source[key])) { //只处理纯JS对象，不处理window与节点
        util.Object.merge(source[key], current);
    } else {
        source[key] = cloneOf(current)
    }
    return source;
}

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
    	for(var i = 0, n = obj.length, ret = []; i < n; i++) {
    		var val = fn.call(obj[i], obj[i], i);
    		if(!!val){
    			ret[ret.length - 1] = obj[i];
    		}
    	}
    	return ret;
    }
}

"String,Array,Number,Object".replace(/[^, ]+/g, function(Type){
	util[Type] = function(pack){
		if(util.isPlainObject(pack)){
			var methods = Object.keys(pack);
			methods.forEach(function(method){
				util[Type][method] = pack[method];
			})
		}
	}
})

//string中的方法暂时还没有
util.String();

util.Array({
	contains: function(target, item) {
		return !!~target.indexOf(item);
	},
	removeAt: function(target, index) {
		return !!target.splice(index, 1).length
	},
	remove: function(target, item) {
		var index = target.indexOf(item);

		if(~index){
			return util.Array.removeAt(target, index);
		}
		return false;
	},

	unique: function(target) {
		// 对数组进行去重操作，返回一个没有重复元素的数组
		var ret = [],
			n = target.length;

		for(var i=0; i<n; i++){
			for(var j=i+1; j<n; j++){
				if(target[i] === target[j]){
					j = ++i
				}
				ret.push(target[i]);
			}
		}
		return ret;
	},
	merge: function(first, second) {
		var i = ~~first.length,
			j = 0;
		for(var n=second.length; j<n; j++){
			first[i++] = second[j];
		}
		first.length = i;
		return first;
	},
	union: function(first, array) {
		//对两个数组取并集
		return util.Array.unique(util.merge(first, array));
	},
	intersect: function(target, array) {
		//取出两个数组的交集
		return util.filter(target, function(item){
			return ~array.indexOf(item);
		});
	},
	min: function(target) {
		return Math.min.call(0, target);
	},
	max: function(target) {
		return Math.max.call(0, target);
	},
	ensure: function(target, el) {
		//添加元素，只有目标数组中没有指定元素时候才能添加进去
		if(!~target.indexOf(el)){
			target.push(el);
		}
		return target;
	},
	clone: function(target) {
		var i = target.length,
			result = [];

		while(i--){
			result[i] = cloneOf(target[i]);
		}
		return result;
	}
})

util.Object({
	forEach: function(target, fn) {
		Object.keys(obj).forEach(function(name){
			fn(obj[name], name);
		})
	},
	//将参数一的键值都放入回调中执行，收集其结果返回
    map: function(obj, fn) {
        return  Object.keys(obj).map(function(name) {
            return fn(obj[name], name)
        })
    },
    clone: function(target) {
            //进行深拷贝，返回一个新对象，如果是浅拷贝请使用$.mix
        var clone = {};
        for (var key in target) {
            clone[key] = cloneOf(target[key]);
        }
        return clone;
    },
    merge: function(target, k, v) {
        //将多个对象合并到第一个参数中或将后两个参数当作键与值加入到第一个参数
        var obj, key;
        //为目标对象添加一个键值对
        if (typeof k === "string")
            return mergeOne(target, k, v);
        //合并多个对象
        for (var i=1, n = arguments.length; i<n; i++) {
            obj = arguments[i];
            for (key in obj) {
                if (obj[key]!==void 0) {
                    mergeOne(target, key, obj[key]);
                }
            }
        }
        return target;
    }
})

// window.util = util;