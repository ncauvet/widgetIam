function JAtom(xml) {
this._parse(xml);
};

JAtom.prototype = {
    
    _parse: function(xml) {
    
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
            
            item.title = jQuery('title',this).eq(0).text();
			
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

