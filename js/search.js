var server="http://Pc-ncauvet:8080/rest/rest/";
var api_key="JHGJHUIYTF277";

function displayFeed(container, feed) {
    var newsFound = false;
    var toto=new Array();
    if(feed) {
        var news = feed;
        
        if(feed.items) {
        	news = feed.items;
        for ( var i in news) {
    var n = news[i];
    toto.push(n);
        	}
        	
		return toto;
        }
    }
}


function log(message,id) {
			
			$("<li id='"+id+"'/>").html(message).prependTo("#ordoList");
			$("#ordoList").attr("scrollTop", 0);
			computeIam(id);		
		}
function computeIam(id){
	//var concatid ="http://172.16.50.184:8080/rest/rest/interactions/products/";
	var concatid =server+"interactions/products/";
	$("#ordoList li").each( function() {concatid += $(this).attr("id")+',';});
	IamAnalyze(concatid + "?api_key="+api_key);
}
function deleteProduct(id){
	$("#"+id).remove();
	computeIam(id);
}

function deleteAllProduct(){
	$("#ordoList li").remove();
	$("#AIMlist img").remove();
}


function init(){
	var widget = '<div id="wrapper">'+
				'<div id="search_interaction">'+
					'<div id="header">'+
						'<div id="pills"><img src="pill_red.png" alt="red pills" height="19" width="19" border="0"/></div>'+
					'</div>'+
					'<div id="search_bar">'+
						'<div class="ui-widget"><input id="searchName" border="0"/></div>'+
					'</div>'+	
				'<div id="content" class="ui-widget"></div>'+
				'<div id="content_footer"></div>'+
			'</div>';
	
	var ordoVirtuelle='<div id="divOrdonnanceVirtuelle">'+
					'<div class="moduleWrap"><input type="hidden" id="nbDrugsInPrescription" value="3"/>'+
						'<div class="topButton"><a href="javascript:deleteAllProduct()"><img src="./trash.gif" alt="remove all" width="10" height="10" />remove All</a></div>'+
						'<h2 id="prescriptionTitle"><span>Prescription</span></h2>'+
						'<ul id="ordoList"></ul><div id="AIMlist"></div>'+
					'</div>'+
				'</div>';
	
	var detailInteraction = '<div id="AIMdetail" class="stdWindow" style="display:none;">'+
							'<a class="closeBox" onclick="jQuery.toggleCloseBox();return false;" href="#" title="close"><img src="./close.gif" alt="close" width="28" height="28" /></a>'+
							'<div class="AIMnav" id="AIMnav">'+
								'<a class="prevAIM" href="#" onClick="return jQuery.ordonanceToggleAIM(false);">Int&#233raction pr&#233c.</a>'+
								'<a class="nextAIM" href="#" onClick="return jQuery.ordonanceToggleAIM(true);">Int&#233raction suiv.</a>'+
							'</div>'+
						'</div>';
						
	$("#vidal_iam_widget").html(widget);
	$("#content").html(ordoVirtuelle);
	$(detailInteraction).insertAfter("#vidal_iam_widget");
	
	
  	
}

function initJS(){

	/* Initialize all AIM hidden */
	if ($('#AIMdetail') != null) {
		$('.AIMcontent').hide();
	}
	/* Show a specific AIM */
	jQuery.ordonanceShowAIM = function(id) {
		$('.AIMcontent').hide();
		$('#' + id).show();
	}

	/* Toggle the AIM (manage first and last if prev or next call) */
	jQuery.ordonanceToggleAIM = function(next) {
		var visibleElement = $('.AIMcontent:visible');
		if (next) {
			// If the next element exist, show it. If not, show the first
			if (visibleElement.next('.AIMcontent').length > 0) {
				visibleElement.next('.AIMcontent').show();
			} else {
				$('.AIMcontent:first').show();
			}
		} else {
			// If the prev element exist, show it. If not, show the last
			if (visibleElement.prev('.AIMcontent').length > 0) {
				visibleElement.prev('.AIMcontent').show();
			} else {
				$('.AIMcontent:last').show();
			}
		}
		visibleElement.hide();
	}


	/*
	 * Affiche/masque le module Detail Interactions, fenetre modale avec le
	 * plugin blockUI
	 */
	$.blockUI.defaults.css = {};
	$.blockUI.defaults.overlayCSS.backgroundColor = '#666';
	$.blockUI.defaults.overlayCSS.opacity = '0.2';
	/* Close box */
	jQuery.toggleCloseBox = function() {
		$.unblockUI();
		return false;
	};
	/* Toggler function for AIM link */
	jQuery.toggleAIMLink = function() {
		$.blockUI( {
			message : $('#AIMdetail'),
			centerX : true,
			centerX : false
		});
		return false;
	};

	jQuery.toggleAim = function() {
		$divOrdonnanceVirtuelle = $('#divOrdonnanceVirtuelle');
		jQuery.hideMenuElements($divOrdonnanceVirtuelle);
		if ($divOrdonnanceVirtuelle.is(':hidden')) {
			$divOrdonnanceVirtuelle.show();
		} else {
			$divOrdonnanceVirtuelle.hide();
		}
		return false;
	};
	
	
}
function VidalIamWidget() {
var container = "searchName";
var containerAnalyze= "iamContainer";
init();
initJS();
$('#'+container).autocomplete({
		source:function(request, response) {
		jQuery.getFeed( {
	//	url : "http://172.16.50.184:8080/rest/rest/products?q="+request.term+"&&api_key=JHGJHUIYTF277",
		url : server+"products?q="+request.term+"&&api_key="+api_key,
		success : function(data) { 
			
						response($.map(data.items, function(item) {
							return {
								label: item.links[0].title ,
								value: item.links[0].title,
								id :(item.links[0].href.split('/'))[4]
							}
						}))}						})
    },minLength: 3,
			select: function(event, ui) {
				log(ui.item ? ( ui.item.label + '<img src="./trash.gif" alt="delete" width="10" height="10" onclick=deleteProduct('+ui.item.id+') />') : "Nothing selected, input was " + this.value,ui.item.id ,containerAnalyze );
			$('#searchName').text("toto");
			
			}

		});
}


function IamAnalyze(url) {
    var u = url;
    jQuery.getFeed( {
	url : u,
	success : function(feed) {
	    var newsFound = displayNews(feed);
	}
    });
}

function displayNews(feed) {
    var newsFound = false;
    $("#AIMlist div").remove();
    if(feed) {
        var news = feed;
        if(feed.items) {
        	news = feed.items;
        for ( var i in news) {
    var n = news[i];
    
    var riskComment = n.links[0].title;
	var productIda = (n.links[1].href.split('/'))[4];
	var productIdb = (n.links[2].href.split('/'))[4];
	var productAname = n.links[1].title;
	var productBname = n.links[2].title;
	
	var interactionAname = n.links[3].title;
	var interactionBname = n.links[4].title;
	
	var iamId = (n.links[0].href.split('/'))[4];
	var gravity = n.categories[0].term;
		
	addPills(productIda,productIdb,productAname,productBname,iamId,gravity);
	addComment(iamId,n.summary,productAname,productBname,interactionAname,interactionBname,gravity,riskComment);
	
        	}
        }
    }

}
function addPills(productIdA,productIdB,productNameA,productNameB,iamId,gravity){
var gravityPictog = gravityPicto(gravity);
var html = "<img class='pills' id='img-"+iamId+"-"+productIdA+"-"+productIdB+"' src='"+gravityPictog+"' onclick='jQuery.ordonanceShowAIM(\"i100"+iamId+"\");jQuery.toggleAIMLink();return false;'/>"+productNameA +" / "+productNameB;
$("<div id='iamline-"+iamId+"-"+productIdA+"-"+productIdB+"'/>").html(html).prependTo("#AIMlist");
}

function gravityPicto(gravity){
var gravityPicto="";

if(gravity == "CONTRAINDICATIONS"){
	gravityPicto="picto_interaction40.gif";
}
else if(gravity == "DISADVISES_ASSOCIATION"){
gravityPicto="picto_interaction30.gif";
}
else if(gravity == "PRECAUTION_USE"){
gravityPicto="picto_interaction30.gif";
}
else if(gravity == "TAKE_INTO_ACCOUNT"){
gravityPicto="picto_interaction_vert.gif";
}
return gravityPicto;

}

function addComment(iamId,comment,productNameA,productNameB,interactionNameA,interactionNameB,gravity,riskComment){
  var html ='<table><tbody><tr><td class="AIMheader"><div class="">Int&#233ractions :</div>'+
  '<ul><li class="interaction10">'+productNameA+'<br/><span>'+interactionNameA+'</span>'+
  '</li><li class="interaction10">'+productNameB+'<br/><span>'+interactionNameB+'</span></li></ul>'+
  '</td></tr><tr><td class="info1"><span class="boldItem">Niveau de gravit&#233 :</span><img src="./'+gravityPicto(gravity)+'"/><span class="alert40">'+gravity+'</span>'+
  '</td></tr><tr><td class="info1">'+
  '<span class="boldItem">Nature du risque :</span>'+riskComment+'</td></tr><tr><td class="info2"><span class="boldItem">Conduite &#224 tenir :</span>'
  +comment+'</td></tr></tbody></table>';

$('<div id="i100'+iamId+'" class="AIMcontent"/>').html(html).insertAfter("#AIMnav");


}

//
//            * Display the next AIM and hide the previous AIM.
//                 * @param boolean true = next AIM, false = previous AIM
//                 */
function ordonanceToggleAIM(next) {
	var visibleElement = $('.AIMcontent:visible');
	if(next) {
	// If the next element exist, show it. If not, show the first
	if(visibleElement.next('.AIMcontent').length > 0) {
		visibleElement.next('.AIMcontent').show();
	} else {
		$('.AIMcontent:first').show();
    }
    } else {
        // If the prev element exist, show it. If not, show the last
            if(visibleElement.prev('.AIMcontent').length > 0) {
				visibleElement.prev('.AIMcontent').show();
				} else {
                $('.AIMcontent:last').show();
				}
            }
            visibleElement.hide();
}

				
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

function JAtom(xml) {
this._parse(xml);
};

JAtom.prototype = {
    
    _parse: function(xmlInit) {
		var xml = transformXml(xmlInit);
        var channel = jQuery('feed', xml).eq(0);
        this.version = '1.0';
        this.title = jQuery(channel).find('title:first').text();
		this.link = jQuery(channel).find('link:first').attr('href');
		this.description = jQuery(channel).find('subtitle:first').text();
		this.language = jQuery(channel).attr('xml:lang');
        this.updated = jQuery(channel).find('updated:first').text();
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


function transformXml(xml) {
if (!jQuery.support.htmlSerialize) {
//If IE 6+
var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
xmlDoc.loadXML(xml);
xml = xmlDoc;
}
return xml;
};
