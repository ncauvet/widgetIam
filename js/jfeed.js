/* jFeed : jQuery feed parser plugin
 * Copyright (C) 2007 Jean-François Hovinne - http://www.hovinne.com/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 */

jQuery.getFeed = function(options) {

    options = jQuery.extend({
    
        url: null,
        data: null,
        success: null
        
    }, options);

    if(options.url) {

        $.ajax({
            type: 'GET',
            url: options.url,
			jsonp:'callback-function',
            dataType: 'jsonp',
			scriptCharset: "utf-8",
			contentType: "application/x-javascript; charset=utf-8",
            success: function(data,textStatus) {
            //alert( "new     :    "+data);
			   //alert(utf8_decode (data));
				var feed = new JFeed(data);
               if(jQuery.isFunction(options.success)) options.success(feed);
            },
        	error: function (xhr, msg, e){
			alert(msg);
            	if(jQuery.isFunction(options.failure)) options.failure(msg, e);
            }
        });
    }
};

function JFeed(xml) {
    if(xml) this.parse(xml);
};

JFeed.prototype = {

    type: '',
    version: '',
    title: '',
    link: '',
    description: '',
    parse: function(xml) {
        
        if(jQuery('channel', xml).length == 1) {
        
            this.type = 'rss';
            var feedClass = new JRss(xml);

        } else  {
        
            this.type = 'atom';
            var feedClass = new JAtom(xml);
        }
        
        if(feedClass) jQuery.extend(this, feedClass);
    }
};
function utf8_decode ( str_data ) {
    // Converts a UTF-8 encoded string to ISO-8859-1  
    // 
    // version: 1006.1915
    // discuss at: http://phpjs.org/functions/utf8_decode
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'
    var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
    
    str_data += '';
    
    while ( i < str_data.length ) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if ((c1 > 191) && (c1 < 224)) {
            c2 = str_data.charCodeAt(i+1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i+1);
            c3 = str_data.charCodeAt(i+2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
 
    return tmp_arr.join('');
}

function JAtom(xml) {
this._parse(xml);
};

JAtom.prototype = {
    
    _parse: function(xml) {
    
        var channel = jQuery('feed', xml).eq(0);
		//alert("xml: "+xml);
        this.version = '1.0';
        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').attr('href');
        this.description = jQuery(channel).find('subtitle:first').text();
        this.language = jQuery(channel).attr('xml:lang');
        this.updated = jQuery(channel).find('updated:first').text();
        //alert("titi:"+jQuery(channel).find('link:first').attr('href'));
        this.items = new Array();
        
        var feed = this;
        
        jQuery('entry', xml).each( function() {
        
            var item = new JFeedItem();
            
            item.title = jQuery('',this).eq(0).text();
			
            item.published = jQuery(this).find('published').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).attr('href');
			
            item.description = jQuery(this).find('content').eq(0).text();
            item.updated = jQuery(this).find('updated').eq(0).text();
            item.id = jQuery(this).find('id').eq(0).text();
            item.summary = jQuery(this).find('summary').eq(0).text();

            item.categories = new Array();
	        jQuery('category', this).each( function() {
	            	var category = {scheme:jQuery(this).attr('scheme'), term:jQuery(this).attr('term')};
	            	item.categories.push(category);
	        });
	        
	        item.links = new Array();
	        jQuery('link', this).each( function() {
	            	var link = {rel:jQuery(this).attr('rel'), href:jQuery(this).attr('href'), title:jQuery(this).attr('title')};
	            	item.links.push(link);
	        });
            
	        
            feed.items.push(item);
        });
    }
};

function JFeedItem() {};

JFeedItem.prototype = {

    title: '',
    link: '',
    description: '',
    updated: '',
    id: '',
    published: '',
    categories: '',
    links: '',
    summary: ''
};


