var newJson = {};
var categories = new Array();

// make sure it is the same call as call in results.html, used for tracking categories
$.ajax({
  url: "resources/items.json",
  cache: false,
  dataType: "json",
  crossDomain: true,
  mimeType: "application/j-son;charset=UTF-8",
  success: function(data){
	  $.each(data, function(i, item) {
		  if(item.NameCat.trim() && !item.Retail.trim() && !item.UPC.trim()){ //signifies category
			  newJson[item.NameCat.trim()] = {};
			  categories.push(item.NameCat.replace(':', '').replace('/',' / ').trim());
		  }
	  });
	  var numCategories = Object.keys(newJson).length;
	  console.log('number of categories: ' + numCategories);
	  
	  drawStage();
  },
  error: function(e, xhr){
     alert('an error has occurred, we apologize for the inconvenience');
  }
});

//$(document).ready(function(){
function drawStage(){   
	
	 var lastDist = 0;
     var startScale = 1;
    
      var stage = new Kinetic.Stage({
          container: 'container',
          width: window.innerWidth*.95,
          height: window.innerHeight*.95
      });
      var layer = new Kinetic.Layer();
      stage.add(layer);

      var imageObj = new Image();
      imageObj.onload = function() {
        var store = new Kinetic.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: stage.getWidth(),
          height: stage.getHeight()
        });
        // add the shape to the layer
        layer.add(store);
        addRectangularAreas(categories.length);
        // add the layer to the stage
      };
      imageObj.src = 'img/background.png';
      //imageObj.src = 'resources/temp.png';
      
      function addRectangularAreas(numOfAreas){ // equal rectangular areas
    	  var width = stage.getWidth()/numOfAreas;
    	  for(var i=0; i<numOfAreas; i++){
    		  var x= width*i;  
    		  var y= stage.getHeight()*.25;
    		  var height = .5* stage.getHeight();
    		  var color = get_random_color();
    		  makeRect(x,y,width,height,color,categories.pop(),i);
    	  }
    	  addAllButton();
	      layer.batchDraw();
	      stage.batchDraw();
      }
      
      function addAllButton(){
    	  var x = stage.getWidth()/4;
    	  var y = 0;
    	  var color = 'blue';
    	  var text = 'All';
    	  var count = 'All';
    	  var width = stage.getWidth()*.5;
    	  var height = stage.getHeight()*.25;
    	  makeRect(x,y,width,height,color,text,count);
      };
      
      function makeRect(x,y,w,h,color,text,count){
    	  var rectangle = new Kinetic.Rect({
        	   x: x,
        	   y: y,
         	   fill: color,
         	   width: w,
        	   height: h,
               stroke: color,
               strokeWidth: 5,
               opacity: .2
          });
    	  
    	  var rectText = new Kinetic.Text({
		        x: x,
		        y: rectangle.getY()+rectangle.getHeight()/2,
		        width: w,
		        text: text,
		        fontSize: 50,
		        fontFamily: 'Calibri',
		        fill: 'black', //get_random_color(),
		        stroke: 'black',
		        strokeWidth: 1,
		        align: 'center'
    	  });
    	  
    	  rectangle.on('click touchstart', function(){
    		  window.location = 'results.html?category='+(count);
    	  });
    	  rectText.on('click touchstart', function(){
    		  window.location = 'results.html?category='+(count);
    	  });
    	  
    	  layer.add(rectangle);
    	  layer.add(rectText);
    	  
    	  function getDistance(p1, p2) {
	          return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
	      }
    	  stage.getContent().addEventListener('touchmove', function(evt) {
    	        var touch1 = evt.touches[0];
    	        var touch2 = evt.touches[1];

    	        if(touch1 && touch2) {
    	        	
    	          var dist = getDistance({
    	            x: touch1.clientX,
    	            y: touch1.clientY
    	          }, {
    	            x: touch2.clientX,
    	            y: touch2.clientY
    	          });

    	          if(!lastDist) {
    	            lastDist = dist;
    	          }

    	          var scale = stage.getScale().x * dist / lastDist;

    	          stage.setScale(scale);
    	          stage.draw();
    	          lastDist = dist;
    	        }
	      }, false);
    	  
      };
};

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    console.log(color);
    return color;
}

