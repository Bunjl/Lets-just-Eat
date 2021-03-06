angular.module('lg.controllers')

.controller('PlacePickCtrl', function($scope,$rootScope,$state,$http, CORSURL, Categories, $q) {
    var lat = "61.483";
    var lon = "23.8866";
    
    $scope.getLocation = function() {
    navigator.geolocation.getCurrentPosition(function(pos) {
      console.log(pos.coords.heading);
          lat = pos.coords.latitude;
          lon = pos.coords.longitude; 
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
    };
    $scope.getLocation();

 	$scope.getPlaces = function(){ 
    //$http.get(CORSURL+'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&radius=150000&types=restaurant&opennow=true&key=AIzaSyDJYwKcoyQSN7C1wURGhQMH75uVHrDGhy4')
 	$http.get(CORSURL+'http://www.lounaat.info/ajax/map?latSW=61.49519086195719&lngSW=23.7177893813232&latNE=61.501334434748955&lngNE=23.759846418676716&view=l%C3%A4hist%C3%B6ll%C3%A4')
  .then(function successCallBack(response){
		$scope.data = response.data;
	
        Letters = function() {
          this.lettersDOM = null;
          this.active = null;
          this.letters = [];
          this.alphabet = ["a", "b", "c", "d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","i","u","v","w","x","y","z","~","&","|","^","ç","@","]","[","{","}","ù","*","µ","¤","$","£","€","°",")","(","+","-","/","<",">","²","`","é","è","1","2","3","4","5","6","7","8","9","0"
          ];

          return this;
        };

        Letters.prototype.init = function( word ) {
          
          this.lettersDOM = document.querySelectorAll('.letter');
          this.active = true;
          var i;
          var nextChar;
          var lettersMax = this.lettersDOM.length;
          
          for ( i = 0; i < this.lettersDOM.length; i++ ) {
            
            if ( word.charAt( i ) != "" )
              nextChar = word.charAt( i );
            else 
              nextChar = false;
            
            this.letters.push( new Letter( this.lettersDOM[ i ],  nextChar ) );
            
          }
          
          if ( word.length > lettersMax ) {
            
            var wordContainer = document.getElementById("word");

            for ( i = lettersMax; i < word.length; i++ ) {
              var letterSpan = document.createElement('span');
              letterSpan.innerHTML = "";
              letterSpan.classList.add('letter');
              wordContainer.appendChild( letterSpan );
              this.letters.push( new Letter( letterSpan,  word.charAt( i ) ) );
            }
          }
          
          this.animate();
          
          return this;
          
        };

        Letters.prototype.animate = function() {
          var i;
          var random;
          var char;
          
          if ( this.active ) {
         
            window.requestAnimationFrame( this.animate.bind(this) );
            
            var indexes = [];

            for ( i = 0; i < this.letters.length; i++ ) {
            
              var current = this.letters[ i ];  
              
              if ( !current.isDead ) {     
                random = Math.floor(Math.random() * (this.alphabet.length - 0));
                char = this.alphabet[ random ]; 
                current.render( char );
              } else {
                indexes.push( i );
              }
            } 
            
            for ( i = 0; i < indexes.length; i++ ) {
              this.letters.splice( indexes[ i ], 1 );
            }
            
            if ( this.letters.length == 0 ) {
              this.stop();
            }
          }
        };

        Letters.prototype.start = function( word ) {
          this.init( word );
        };

        Letters.prototype.stop = function() {
          this.active = false;
        };

        Letter = function( DOMElement, nextChar ) {
          
          var scope = this;
          
          this.DOMEl = DOMElement;
          this.char = DOMElement.innerHTML;
          this.next = nextChar;
          this.speed = Math.floor(Math.random() * (500 - 10) );
          this.total = 0;
          this.duration = 500;
          this.animating = true;
          this.isDead = false;
          
          this.timer = setInterval(function() { 
            if ( scope.animating === true ) {
              scope.total += scope.speed;
            } 
            scope.animating = !scope.animating;
          }, this.speed);

          this.animate();
          
          return this;
         
        };

        Letter.prototype.animate = function() {
          var i;
          var random;
          
          if ( !this.isDead ) {
            window.requestAnimationFrame( this.animate.bind(this) );
          }
          
          
          if ( this.total < this.duration ) {
            
            if ( this.animating ) {
              this.DOMEl.innerHTML = this.char;
            }
              
          } else {
            this.isDead = true;
            
            if ( !this.next ) {
              var parent = document.getElementById('word');
              parent.removeChild( this.DOMEl );
              return;
            }
            
            this.DOMEl.innerHTML = this.next;
          }
        };

        Letter.prototype.render = function( char ) {
          
          if ( !this.animating ) {
            this.char = char;
          }
          
        };


        var letters = new Letters();

        $scope.getPlace = function() {
           var rand = (Math.floor(Math.random() * $scope.data.length) + 1);
            letters.start( response.data[rand].name );
            $scope.thePlace = response.data[rand];
            $scope.rating = response.data[rand].rating;
            var placeid = response.data[rand].place_id;
            
        };

	   }, function errorCallBack(response){

			});

    };

    $scope.getPlaces(); 
    $scope.categories = Categories.all();

   $scope.toggleCategory = function(id){
        Categories.toggle(id);
        searchLocations();
        updateActive();
      };


});


