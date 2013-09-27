// Inits
var searchEnabled = false;
var template;
var categories = new Array();

// Load template first //
$.ajax({
	url: "resources/itemTemplate.html#template",
	type: 'GET',
    success: function(res) {
      console.log('loading template');
      template = $(res).html();
      console.log('page is ready');
      pageReady(); // once template is ready, load the page
    }
});


// Load items //
function pageReady(){
	$.ajax({
	  url: "resources/items.json",
	  cache: false,
	  dataType: "json",
	  crossDomain: true,
	  mimeType: "application/j-son;charset=UTF-8",
	  success: function(data){
		  var newJson = {};
		  var category = "";
		  $.each(data, function(i, item) {
			  if(item.NameCat.trim() && !item.Retail.trim() && !item.UPC.trim()){ //signifies category
				  //create new array
				  if(category.trim()){
					  console.log('number of keys for ' + category + ': ' + Object.keys(newJson[category]).length);
				  }
				  newJson[item.NameCat.trim()] = {};
				  category = item.NameCat.trim();
				  categories.push(item.NameCat.trim()); //push list of categories
			  } else {
				  //place in latest array
				  newJson[category][i] = item;
			  }
		  });
		  if(category.trim())
			  console.log('number of items for ' + category + ': ' + Object.keys(newJson[category]).length);
		  console.log('number of categories: ' + Object.keys(newJson).length);
		  
		  //parse items
		  if(GetUrlValue('category').trim() == 'All'){
			  myItems = data;
		  } else {
			  var cat = getObjectByIndex(categories, GetUrlValue('category').trim());
			  console.log('looking at category: ' + cat);
			  myItems = newJson[cat];
		  }
		  $.each(myItems, function(i, item) {
			  // we are hitting an item if it has a name, price, and code
		    if(item.NameCat.trim() && item.Retail.trim() && item.UPC.trim()){
		    	$('#test').append(createItemFromTemplate(item,template));
		    }
	      });
		  
		  searchEnabled = true;
		  console.log('number of items: ' + $('#test').children().length);
		  console.log('Search enabled');
		  
		  $('.spm').each(function(i, item){
			  var location = "http://sywkapp302p.prod.ch3.s.com:8180/sears_selfcheckout/productdetails.do?fromPage=search&bucketSource=Online&partNumber="+ $(item).attr('id');
			  $(item).parentsUntil('li').bind('tap click', function(){
				  window.location = location;
			  });
		  });

	  },
	  error: function(e, xhr){
	     alert('an error has occurred, we apologize for the inconvenience');
	  }
	});
}
    
function createItemFromTemplate(item,template){
	var data = {
	 name : item.NameCat.replace('?',' '),
	 image : createImageForItem(item),
	 retailPrice : item.Retail,
	 searsPrice : item.SearsCost,
	 upc : item.UPC,
	 spm : item.SPM
	};
	
	return Mustache.to_html(template, data);  
}

function createImageForItem(item){
	var root = item.PictureLink;
	var sku = item.Sku;
	if(item.Sku.indexOf(',')){
		var parts = item.Sku.split(',');
		sku = parts[0];
	}
	return root + sku + '.jpg';
}
//			//         //         //        END LOAD ITEMS
        
    
    
//			//         //         //        SEARCH

//make contains case insensitive // override regular jquery function
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

function search(){ 
    $('#message').hide();
	searchTerm = $("#search").val().trim();
	searchTerm2 = $("#search").val().trim().split(' ');
	
	//must search by item number, syw number, title, or description
	
	if(searchEnabled){
		console.log('searching for '+ searchTerm);
		var results = $('p:contains("' + searchTerm2.join('"), p:contains("') + '")');
		console.log('terms: ' + searchTerm2);

		$('.block').hide(); // each item has a block class, hide all elements
		results.parent().parent().show(); // results are li which need to point to a parent which will be shown
                
        if(results.length == 0){
            console.log('No results found');
            $('#message').show(); 
            $('#message').text('No results found for ' + searchTerm);
        }
	}
	else {
		console.log('search is disabled, items might not be loaded');
	}
};

// Search Json for key
function getObjectByIndex(categories, atIndex){
	categories = categories.reverse();
	for(var i=0; i<categories.length; i++){
		var category = categories[i];
		//alert(category)
		if(i == atIndex){
			return category;
		}
	}
	return null;
}
//       //         //         //       END SEARCH

//get the variable in the url
function GetUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            return KeyValuePair[1];
        }
    }
}