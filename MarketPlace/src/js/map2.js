var newJson = {};
var categories = new Array();
var numCategories = 0;

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
	  numCategories = Object.keys(newJson).length;
	  console.log('number of categories: ' + numCategories);
	  
	  drawStage();
  },
  error: function(e, xhr){
     alert('an error has occurred, we apologize for the inconvenience');
  }
});

function drawStage(){   
	
	 var lastDist = 0;
     var startScale = 1;
    
      var stage = new Kinetic.Stage({
          container: 'container',
          width: window.innerWidth*.95,
          height: window.innerHeight*.95
      });
      var layer = new Kinetic.Layer();
      

      var imageObj = new Image();
      imageObj.onload = function() {
        var store = new Kinetic.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: stage.getWidth(),
          height: stage.getHeight()
        });
        // add the shape to the layer //
        layer.add(store); // need to add image //
        //addRectangularAreas(categories.length); ////////////////////
        
        // Points
        var heightFivePercent = stage.getHeight()/20; // divide page into grid
        var widthFivePercent = stage.getWidth()/20;
        
        var points1 = [0,0, 3*widthFivePercent,-6*heightFivePercent, 3*widthFivePercent,-10*heightFivePercent, 0*widthFivePercent,-6*heightFivePercent];
        addCustomShape(4*widthFivePercent, 15*heightFivePercent, points1, categories.shift(), categories.length);
        
        var points2 = [0,0,6.5*widthFivePercent,0,6.5*widthFivePercent,-6*heightFivePercent, 0,-6*heightFivePercent];
        addCustomShape(7*widthFivePercent, 17*heightFivePercent, points2, categories.shift(), categories.length); 
        
        var points3 = [0,0, 6.5*widthFivePercent,0, 5*widthFivePercent,-3*heightFivePercent, 1*widthFivePercent,-3*heightFivePercent];
        addCustomShape(7*widthFivePercent, 10*heightFivePercent, points3, categories.shift(), categories.length); 
        
        var points4 = [0,0, 0,-6*heightFivePercent, -3*widthFivePercent,-8*heightFivePercent, -3*widthFivePercent,-5.5*heightFivePercent];
        addCustomShape(16*widthFivePercent, 15*heightFivePercent, points4, categories.shift(), categories.length); 
        
        var points5 = [0,0, 0,-6*heightFivePercent, -2.5*widthFivePercent,-7*heightFivePercent, -2.5*widthFivePercent,-2*heightFivePercent];
        addCustomShape(20*widthFivePercent, 14*heightFivePercent, points5, categories.shift(), categories.length); 
        
        console.log('redrawing');
        stage.add(layer);
        
  	    stage.batchDraw();
      };
      imageObj.src = 'img/background.png';
      
      function addCustomShape(x, y, points, text, count){ // pass in starting x,y coord, then an array of points relative to that point
    	  var polygon = new Kinetic.Polygon({
    		  x: x,
    		  y: y,
    		  points: points,
    		  fill: get_random_color(), //'#00D2FF',
    		  stroke: 'black',
    		  strokeWidth: 5,
    		  opacity: .25
    		});
    	  
    	  // if item coordinates are horizontally beyond the screen, move it 10% to the left
    	  if(x > stage.getWidth()-stage.getWidth()/10) 
    		  x -= stage.getWidth()/10;
    	  
    	  var rectText = new Kinetic.Text({
		        x: x,
		        y: y,
		        text: text,
		        fontSize: 20,
		        fontFamily: 'Calibri',
		        fill: 'black', //get_random_color(),
		        stroke: 'black',
		        strokeWidth: 1,
		        align: 'center'
    	  });
    	  
    	  polygon.on('click tap', function(){
    		  window.location = 'results.html?category='+(count);
    	  });
    	  rectText.on('click tap', function(){
    		  window.location = 'results.html?category='+(count);
    	  });
    	  
    	  layer.add(polygon);
    	  layer.add(rectText);
    	  
    	  console.log('adding polygon');
      }
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

function search(){
	var searchTerm = $("#search").val().trim();
	window.location = 'results.html?category=All&search='+searchTerm;
}

/* 
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
*/
