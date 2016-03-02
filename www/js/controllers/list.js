angular.module('lg.controllers')

.controller('ListCtrl', function($scope,$rootScope,$state,$http, CORSURL, Categories, $q) {


 	$http.get(CORSURL+'https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+tampere&key=AIzaSyDJYwKcoyQSN7C1wURGhQMH75uVHrDGhy4')
 	.then(function successCallBack(response){
		$scope.data = response.data.results;
			
        var padding = {top:20, right:40, bottom:0, left:0},
            w = 100 - padding.left - padding.right,
            h = 100 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            color = d3.scale.category20c();//category20c()

        var data = $scope.data;
        console.log(data);
         /*
         [
                    {"label":"Question 1",  "value":1,  "question":"What CSS property is used for specifying the area between the content and its border?"}, // padding
                    {"label":"Question 2",  "value":1,  "question":"What CSS property is used for changing the font?"}, //font-family
                    {"label":"Question 3",  "value":1,  "question":"What CSS property is used for changing the color of text?"}, //color
                    {"label":"Question 4",  "value":1,  "question":"What CSS property is used for changing the boldness of text?"}, //font-weight
                    {"label":"Question 5",  "value":1,  "question":"What CSS property is used for changing the size of text?"}, //font-size
                    {"label":"Question 6",  "value":1,  "question":"What CSS property is used for changing the background color of a box?"}, //background-color
                    {"label":"Question 7",  "value":1,  "question":"Which word is used for specifying an HTML tag that is inside another tag?"}, //nesting
                    {"label":"Question 8",  "value":1,  "question":"Which side of the box is the third number in: margin:1px 1px 1px 1px; ?"}, //bottom
                    {"label":"Question 9",  "value":1,  "question":"What are the fonts that don't have serifs at the ends of letters called?"}, //sans-serif
                    {"label":"Question 10", "value":1, "question":"In CSS selectors, what character prefix should one use to specify a class?"}, //period

        ];*/


        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);

        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

        var vis = container
            .append("g");
            
        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");
            

        arcs.append("path")
            .attr("fill", function(d, i){ return color(i); })
            .attr("d", function (d) { return arc(d); });

        // add the text
        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
            })
            .attr("text-anchor", "end")
            .text( function(d, i) {
                return data[i].name;
            });

        container.on("click", spin);


        function spin(d){


            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;




            rotation += 90 - Math.round(ps/2);

            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){

                    //mark question as seen
                   /* d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#111");*/

                    //populate question
                    d3.select("#question h1")
                        .text(data[picked].name);

                    oldrotation = rotation;
                });
        }

        //make arrow
        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"black"});

        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 10)
            .style({"fill":"white","cursor":"pointer"});

        //spin text
       /* container.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({"font-weight":"bold", "font-size":"30px"});*/
        
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                //no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }

            return array;
        }
			}, function errorCallBack(response){

			});
   $scope.categories = Categories.all();

   $scope.toggleCategory = function(id){
        Categories.toggle(id);
        searchLocations();
        updateActive();
      };


});


