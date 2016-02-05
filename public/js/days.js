'use strict';
/* global $ attractionsModule */

var daysModule = (function(){

  // state (info that should be maintained)

  var days = [],
      currentDay;

  // jQuery selections

  var $dayButtons, $dayTitle, $addButton, $removeDay;
  $(function(){
    $dayButtons = $('.day-buttons');
    $removeDay = $('#day-title > button.remove');
    $dayTitle = $('#day-title > span');
    $addButton = $('#day-add');
  });

  // Day class

  function Day () {
    this.hotel = null;
    this.restaurants = [];
    this.activities = [];
    this.number = days.push(this);
    this.buildButton().drawButton();
  }

  Day.prototype.buildButton = function() {
    this.$button = $('<button class="btn btn-circle day-btn"></button>')
      .text(this.number);
    var self = this;
    this.$button.on('click', function(){
      this.blur();
      getDay(self)
    });
    return this;
  };


  function getDay(day){
    $.ajax({
      method: 'GET',
      url: '/api/days/'+day.number,
      success: function(response){
        for(var key in day){
          if(response.hasOwnProperty(key)){
            day[key] = response[key];
            if(key === 'hotel' && day[key]){   
              day[key].type = key;        
              day[key] = attractionsModule.create(day[key]);
            }
            if(key==="restaurants" || key === "activities"){
              day[key]=day[key].map(function(attraction){
                attraction.type = key = "restaurants" ? "restaurant" : "activity";
                attraction = attractionsModule.create(attraction);
                return attraction;
              });
            }
          }
        }
        day.switchTo.call(day);
        },
      error: function(err){
        console.log(err);
      }
    });
  }

  Day.prototype.drawButton = function() {
    this.$button.appendTo($dayButtons);
    this.$button = this.$button;
    return this;
  };

  Day.prototype.switchTo = function() {
    // day button panel changes
    currentDay.$button.removeClass('current-day');

    // itinerary clear
    function erase (attraction) { attraction.eraseItineraryItem(); }
    if (currentDay.hotel) erase(currentDay.hotel);
    currentDay.restaurants.forEach(erase);
    currentDay.activities.forEach(erase);

    // front-end model change
    currentDay = this;

    // day button panel changes
    currentDay.$button.addClass('current-day');
    $dayTitle.text('Day ' + currentDay.number);

    // itinerary repopulation
    function draw (attraction) { 
        console.log('attraction', attraction);
      attraction.drawItineraryItem(); 
    }
    console.log("Curerentnten Day ", currentDay);
    if (currentDay.hotel) draw(currentDay.hotel);
    currentDay.restaurants.forEach(draw);
    currentDay.activities.forEach(draw);

    return currentDay;
  };

  // private functions in the daysModule

  function addDay () {
    if (this && this.blur) this.blur();
    var newDay = new Day();
    if (days.length != 0) currentDay = newDay;
    console.log(newDay);
    newDay.switchTo();
    createDay(newDay.number);
  }

  function createDay(number) {
    $.ajax({
      method: 'POST',
      url: '/api/days/',
      data: {number:number},
      success: function(response){
        console.log("Response:",response);
      },
      error: function(err){
        console.log(err);
      }
    });
  }

  function deleteCurrentDay () {
    console.log('will delete this day:', currentDay);
  }

  // jQuery event binding

  $(function(){
    $addButton.on('click', addDay);
    $removeDay.on('click', deleteCurrentDay);
  })


  function getDays(){
    $.ajax({
      method: 'GET',
      url: '/api/days',
      success: function(days){
         if(days.length === 0) $(addDay);
        else{
          days.forEach(function(day){
            var newDay = new Day({
              number: day.number,
              hotel: day.hotel,
              restaurants: day.restaurants,
              activities: day.activities
            });
            currentDay = newDay;
          });
        }
      },
      error: function(err){
        console.log(err);
      }
    });
  }


  function addAttractionToDB(day, attraction){
    $.ajax({
      method: 'POST', 
      data: {id: attraction._id},
      url: '/api/days/'+ day.number + "/" + attraction.type,
      success: function(){
        console.log('successfully added attraction');
      },
      error: function(err){
        console.log(err);
      }
    });
  }

  // globally accessible methods of the daysModule

  var methods = {

    load: function(){
      getDays();
    },

    addAttraction: function(attractionData){
      var attraction = attractionsModule.create(attractionData);
      switch (attraction.type) {
        case 'hotel': currentDay.hotel = attraction; break;
        case 'restaurant': currentDay.restaurants.push(attraction); break;
        case 'activity': currentDay.activities.push(attraction); break;
        default: console.error('bad type:', attraction);
      }
      addAttractionToDB(currentDay, attraction);
    },

    getCurrentDay: function(){
      return currentDay;
    }

  };

  // we return this object from the IIFE and store it on the global scope
  // that way we can use `daysModule.load` and `.addAttraction` elsewhere

  return methods;

}());
