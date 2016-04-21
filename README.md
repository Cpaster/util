#Util

引用方法提供了一个入口方法util；

##基本函数

###mix

杂糅对象， 为一个对象添加更多成员

```javascript
  /*
    *@param {Object} receiver 接收者
	*@param {Object} supplier 提供者
	*return {Object} 目标对象
  */
  util.max(receiver, supplier)
   
```

###type

用于取得数据的类型（一个参数的情况下）或判定数据的类型（两个参数的情况下）

```javascript
    /**
    * @param {Any} obj 要检测的东西
    * @param {String} str 判断obj是否是str 可为空
    * @return {String|Boolean}
    */
  util.type(obj, str)
  
  util.type([], 'Array') //判断是不是数组
   
```

###isPlainObject

判断一个对象是否是纯对象（object或JSON）,而非DOM或者js原生对象

```javascript
    /*
    *@param {Object} obj
	* return {Boolean}
	*/
  util.isPlainObject(obj)
   
```