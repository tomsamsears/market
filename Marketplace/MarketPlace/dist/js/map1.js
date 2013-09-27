var newJson = {};
var categories = new Array();

$.ajax({
  url: "resources/items.json",
  cache: false,
  dataType: "json",
  crossDomain: true,
  mimeType: "application/j-son;charset=UTF-8",
  success: function(data){
	  $.each(data, function(i, item) {
		  if(item.NameCat.trim() && !item.Retail.trim() && !item.UPC.trim()){ //signifies category
			  //create new array
			  newJson[item.NameCat.trim()] = {};
			  categories.push(item.NameCat.trim());
		  }
	  });
	  var numCategories = Object.keys(newJson).length;
	  console.log('number of categories: ' + numCategories);
  },
  error: function(e, xhr){
     alert('an error has occurred, we apologize for the inconvenience');
  }
});

$(document).ready(function(){
	
	$('#storeMapImg').mapster({
		fillColor: '0000FF',
	    fillOpacity: 0.3,
	    mapKey: 'name',
	    showToolTip: true,
	    clickNavigate: true,    
	    areas : [{
		    	key : '1', 
		    	selected : true,
		    	toolTip: categories.pop()
	    	}, 
	    	{
		    	key : '2', 
		    	selected : true,
		    	toolTip: categories.pop()
	    	},
	    	{
		    	key : '3', 
		    	selected : true,
		    	toolTip: categories.pop()
	    	},
	    	{
		    	key : '4', 
		    	selected : true,
		    	toolTip: categories.pop()
	    	},
	    	{
		    	key : '5', 
		    	selected : true,
		    	toolTip: categories.pop()
	    	},
	    	{
		    	key : '6', 
		    	selected : true,
		    	toolTip: "All"
	    	},
	    ]
	});
});

