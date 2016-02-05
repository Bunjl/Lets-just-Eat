// Tranparentizer
// Removes white pixels from image using canvas
// Usage: 
// 
//  <canvas transparentize data-imgurl="urlHere"></canvas>
//

(function(){

angular.module('transparentize', [])

//.value('IMG_PROXY','https://sviitapp-imgproxy.herokuapp.com/?url=')
.value('IMG_PROXY','http://sviit.herokuapp.com/api/imgproxy?url=')



.directive('transparentize', function(IMG_PROXY) {

  var link = function(scope, element, attr) {
        var offset = 7; // how much threshold can variate
        var canvasElem = element[0] || element[0].querySelector('canvas');
            
        var img = new Image();

        img.onload = function() {

            // Create canvas to get image pixels
            var pixels = getPixels(img),
                total = pixels.data.length,
                firstPixel = [pixels.data[0],pixels.data[1],pixels.data[2]],
                lastPixel = [pixels.data[total-4],pixels.data[total-3],pixels.data[total-2]],
                thresholds = inspectThreshold(offset,firstPixel,lastPixel);
            
            //console.log('RGB Thresholds: ',thresholds);
            var i = 0, data = pixels.data, length = data.length;//, threshold = 247;
            for (; i < length; i += 4) {
                // Pixel data is just a huge array where values are ordered RGBARGBARGBA...
                if (data[i] >= thresholds[0] && data[i+1] >= thresholds[1] && data[i+2] >= thresholds[2]) {
                    data[i+3] = 0;
                }
            }
            pixels.data = data;

            canvasElem.width = img.width;
            canvasElem.height = img.height;
            var ctx = canvasElem.getContext("2d");
            ctx.putImageData(pixels, 0, 0);
            img.remove();

        };

        img.crossOrigin = '';
        img.src = IMG_PROXY+scope.imgurl || '';
            
  }

  /*
  * Counts average for R, G and B -values from first and last pixel
  * Offset makes sure that little color variations are allowed with bg-color/pattern
  * Return: array of RGB -thresholds
  */
  var inspectThreshold = function(offset,firstPixel,lastPixel){
    return [
      Math.round((firstPixel[0] + lastPixel[0]) / 2) - offset,
      Math.round((firstPixel[1] + lastPixel[1]) / 2) - offset,
      Math.round((firstPixel[2] + lastPixel[2]) / 2) - offset
    ];
  }

  var getPixels = function(img) {
    var c = getCanvas(img.width, img.height);
    var ctx = c.getContext("2d");
    ctx.drawImage(img,0,0);
    return ctx.getImageData(0,0,img.width,img.height);
  };

  var getCanvas = function(w,h) {
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
  };
         



  return {
    restrict: 'A',
    scope:{
      imgurl:'='
    },
    link: link
    
  }
});




})()
