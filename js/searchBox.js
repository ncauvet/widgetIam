require('/utils.js');

/* SearchBox is implemented for Galaad but is deprecated
 * use RoundedSearchBox which is for Perceval.
 */

function SearchBox(searchDiv, searchTitle) {

	this.query = "";
	var self = this;

	this.onSearch = new Event();
	var events = this.onSearch;
	
	var $container = $("#" + searchDiv);
	$container.html(
			'<div id="searchForm" >' +
			'<div id="searchElmt">' +
			'<input type="text" id="term" name="term" value="" class="searchField" />'+
    		'<button  id="rechercher" value="' + searchTitle + '" onclick="return false;" title="Rechercher un produit par mot-cl&eacute; (nom, substance active, indication, laboratoire)">'+
    		'<span><em>' + searchTitle + '</em></span></button>' +
    		'</div></div>');

	function fire() {
		var term = $("#term").val();
		if (term == null || term.length < 3) {
			alert("Veuillez saisir 3 caractères au minimum.");
		} else {
			self.query = term;
			events.execute(encodeURI(term));
		}
		return false;
	}

	function decodeURL(term) { return unescape(decodeURI(term)); }

	this.shouldLaunchQuery = function() {
		var term = $.getUrlParam("q");
		if (term) {
			$("#term").val(decodeURL(term));
			fire();
		}
	}
	
	function reloadPage() { window.location.href = "search.html?q=" + encodeURI($("#term").val()); }
	$("#rechercher").click(function() { reloadPage() });
	$("#term").keypress(function(e) { if (e.which == 13) reloadPage(); });

}
