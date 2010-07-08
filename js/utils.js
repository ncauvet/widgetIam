
require('/dhtmlx/dhtmlx.js');
require('/json-template/json-template.js');
require('/functional-1.0.2/functional.min.js');

/**
 * Firebug logging graceful degradation for IE.
 */
if (! ("console" in window) || !("firebug" in console)) {
   var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml", "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];
   window.console = {};
   for (var i = 0; i <names.length; ++i) window.console[names[i]] = function() {};
}

/**
 * A simple callback that hide the specified
 * @return false
 */
function genericErrorCallback() {
	return function(httpStatus) { return false; };
}

/**
* Fonction de clonage
* @author Keith Devens
* @see http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
*/
jQuery.extend ({
   /**
    * Clone an object by recursively copying members
    */
   clone: function(srcInstance) {
      if(typeof(srcInstance) != 'object' || srcInstance == null) {
         return srcInstance;
     }
     var newInstance = srcInstance.constructor();
     for(var i in srcInstance) {
         newInstance[i] = $.clone(srcInstance[i]);
     }
     return newInstance;
   },

   /**
    * Generic aggregate core function.
    */
   aggregate: function(f,seed,list) {
      var result=seed;
      for(var index in list){
         result=f(list[index],result);
      }
      return result;
   },
   
   /**
    * String joinWith method.
    */
   joinWith: function(separator,selector,elements) {
      return $.aggregate(function(e,r) { return r==null?selector(e): r+separator+ selector(e); }, null, elements);
   },

   groupBy : function(fn,elements) {
	    if(!elements) return elements;   
	   
	       if (!fn || typeof (fn) !== typeof (Function)) {
	           throw Error.argumentType("fn", typeof (fn), typeof (Function), "groupBy takes a function to filter on");
	       }
	       var ret = new Array();
	       for (var i = 0; i < elements.length; i++) {
	           var key = fn(elements[i]);
	           if(!ret[key]){
	        	   ret[key] = new Array() ;
	           }
	           ret[key].push(elements[i]);	           
	       }
	       var result=new Array();
	       var counter=0;
	       for (var k in ret) {	    	   
	    	   result[counter]={"key":k,"items":ret[k]};  
	    	   counter++;
	       }
	       return result;
	   },
	 objectSize: function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		},
   
   /**
    * Retrieve an specific parameter from the current URL.
    */
   getUrlParam: function(name) {
	   var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	   return results?results[1] || 0:null;
   },
   
   /**
    * Prevent URL caching by adding a timestamp at the end
    */
   preventCaching: function(url) {
	   var timestamp = Math.random() * Math.random();
	   return (url.indexOf("?")==-1 ? url+"?timestamp="+timestamp : url+"&timestamp="+timestamp);
   },

   /**
    * Verify if the parameter is null or empty.
    */
   isEmpty: function(str) {
       return (str == null || str.length == 0) ? true : false;
   },

   /**
    * Validate an url based on some valid protocols.
    */
   validProtocol: function(path) {
       if($.isEmpty(path)) return false;
       return some("'"+path+"'.startsWith(_)", ["http", "ftp"]);
   },

   /**
    * Simple filed validation with custom function.
    */
    validate: function(json) {
        $(".validateError").remove();
        return reduce("x y -> x && y", true, map(function(validation) {
            var valid = validation.validate($("#"+validation.name).val());
            if(!valid) $("#"+validation.name).after("&nbsp;<span class='validateError'>"+validation.message+"</span>");
            return valid;
        }, json.validations));
    }
});

/**
 * Retrieve the direct text of an element and not the text of its possible children (nodes).
 */
jQuery.fn.extend ({
    innerText: function() {
        return this.contents().filter(function(){ return this.nodeType != 1; });
    }
});

/**
 * Repeat function.
 * "Jonas".repeat(5) == "JonasJonasJonasJonasJonas"
 */
String.prototype.repeat = function(times){
   return new Array(times+1).join(this);
};
/**
 * Left trim the string.
 */
String.prototype.ltrim = function (chars) {
   chars = chars || "\\s";
   return this.replace(new RegExp("^[" + chars + "]+", "g"), "");
};
/**
 * Right trim the string.
 */
String.prototype.rtrim = function (chars) {
   chars = chars || "\\s";
   return this.replace(new RegExp("[" + chars + "]+$", "g"), "");
};
/**
 * Trim the string.
 */
String.prototype.trim = function (chars) {
   return this.ltrim(chars).rtrim(chars);
};
/**
 * Retrieve the first upper case word of the string.
 */
String.prototype.retrieveUpperCaseWord = function() {
	return this.replace(new RegExp('[^A-Z]*([A-Z]+).*', "g"), '$1');
}
/**
 * Test if a string starts with another.
 */
String.prototype.startsWith = function(str) {
    return this.indexOf(str) === 0;
}


/**
 * Ajax call that return the response text if one (http 200).
 * @param url the url to call
 * @return responseText the responseText
 * @deprecated do not use synchron method
 */
function ajaxGetResponseText(url) {
	var doc = dhtmlxAjax.getSync(url).xmlDoc;
	if (doc.status != 200) return null;
	return doc.responseText;
}

/**
 * Ajax call that return the complete response (DHTMLX document with status, responseText...).
 * @param url the url to call
 * @return xmlDoc the complete response
 * @deprecated do not use synchron method
 */
function ajaxGetCompleteResponse(url) {
	return dhtmlxAjax.getSync(url).xmlDoc;
}

/**
 * Ajax call that return the complete response (DHTMLX document with status, responseText...).
 * @param url the url to call
 * @return xmlDoc the complete response
 * @deprecated do not use synchron method
 */
function ajaxGetCompleteResponseV2(url, successCallback, errorCallback) {
	if(!successCallback) {
		console.error("Functions 'successCallback(responseText)' must be specified.");
		return false;
	}
	if(!url) {
		console.error("An URL must be specified.");
		return false;
	}
	if(!errorCallback) errorCallback = genericErrorCallback();
	var xmlDoc = dhtmlxAjax.getSync(url).xmlDoc;
	if (xmlDoc.status == 200) {
		return successCallback(xmlDoc.responseText);
	} else {
		return errorCallback(xmlDoc.status);
	}
}

/**
 * Retrieve a rest id from a pattern.
 * Exemple : if we have <code>http://localhost:8080/product/25/deleted</code>, a possible pattern to get
 * the id is '/product/'.
 */
function retrieveIdFromUrl(value, pattern) {
   if(value) {
      return value.substring(value.indexOf(pattern)+pattern.length, value.length).split('/')[0];
   }
   return null;
}

/**
 * Template function that return an object.
 * @param t a string template
 * @return json object with <code>withh</code> function
 */
function template(t){
	 return ({ withh: function(obj) {
		return jsontemplate.Template(t).expand(obj);
	}});
}

/**
 * Template function that return a function that take an object (convenient for Repeater).
 * @param t a string template
 * @return function that take an object
 */
function fromTemplate(t) {
    return function(o) {
        return jsontemplate.Template(t).expand(o);
    };
}

function Event() {
	var handlers=new Array();
	this.add=function(f){
		if( typeof f== "function" ) 
			handlers[handlers.length] = f;
		};
	this.execute=function(param){
		for (var i=0;i<handlers.length;++i){handlers[i](param); }
		};
}

function Event2(){
	var handlers=new Array();
	this.add=function(f){
		if( typeof f== "function" ) 
			handlers[handlers.length] = f;
		};
	this.execute=function(param1,param2){
		for (var i=0;i<handlers.length;++i)handlers[i](param1,param2); 
		};
}

/**
 * ...
 * @param matrix
 * @return
 */
function transpose(matrix){
   var temp;
   var T=new Array();
	for ( i = 0; i < matrix.length; i++) {
		for ( j = 0; j < matrix[0].length; j++) {
			if(!T[j])T[j]=new Array();
			if (i < matrix.length && j < matrix[i].length) {
              temp = matrix[i][j];
              T[j][i] = temp;
			}
           
        }
     }
	return T;
}

function splitAt(list, index){
	var listPrefix = list.slice(0,index);
	var listTail = list.slice(index);
	return [listPrefix,listTail];
}

function asListRowWise(matrix) {	
	return reduce(function(a1,a2){return a1.concat(a2);},new Array(),matrix);
}

function concatTwo(l1,l2){
	var result= new Array();
	  for (var i = 0; i < l1.length; i++)
	        result.push(l1[i]);
	  for (var i = 0; i < l2.length; i++)
	        result.push(l2[i]);
	 return result;
}

/**
 * Takes a list of lists and returns one list that contains all elements of these lists
 * join([[1,2],[3],[4]]) gives [1,2,3,4]
 * @param xss
 * @return
 */
function join(xss){
	return reduce(concatTwo,[],xss);
}

function formInThreeColumns(items) {
    var colSize = function(length,columnNumber){
	    return  Math.ceil(length / columnNumber);
	};
	var splitted = splitAt(items,colSize(items.length, 3));
	var splitted2 = splitAt(splitted[1],colSize(splitted[1].length, 2));
	var table = [splitted[0],splitted2[0],splitted2[1]];
	return asListRowWise(transpose(table));
}

/**
 * Return a function that perform an action if the predicate return true (depending on a val entry or not).
 */
function maybe(action,predicate){
	return function (val) {
		if(!val) {
		    if((!predicate)||(predicate())) return action();
		    else return null;
		} else {
		    if((!predicate)||(predicate(val))) return action(val);
		    else return null;
		}
	};
}

/**
 * Return a function that perform action1 or action2 if the predicate return true or false (depending on a val entry or not).
 */
function either(action1,action2,selector) {
	return function (val) {
		if(!val) {
		    if((!selector)||selector()) return action1();
		    else return action2();
		} else {
		    if((!selector)||selector(val)) return action1(val);
		    else return action2(val);
		}
	};
}

function richLink(text,href) {
	return function(val) {
        if(typeof text == "function" ) {
            var linkObj = text(val);
            return {content:'<a href="'+href+'">'+linkObj.content+'</a>', hover:linkObj.hover};
        } else return {content:'<a href="'+href+'">'+text+'</a>', hover:text};
	};
}

function image(width,height,link,title){
	return function(val) {
		var linkResult;
		if(typeof link == "function" ){
			var linkData = link(val);
			if(!linkData) return null;
			linkResult = linkData.link;
			title = linkData.title;
		} else {
			linkResult = link;
		}
		return {content:'<img height="'+height+'" width="'+width+'" title="'+title+'" alt="'+title+'" src="' +linkResult+'" />', hover:title};
	};
}

function cleanIdFromDhtmlx(id) {
   var splitId = id.split("_");
   if(splitId[1]!=''){
      return splitId[0];
   }
   return null;
}
