var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');


//Get all days
router.get('/',function(req, res){
	Day.find({}).exec()
	.then(function(days){
		res.json(days);
	});
});

//Get one day
router.get('/:id', function(req,res){
	var id = req.params.id;
	Day.findOne({number:id})
	.populate('hotel')
	.populate('restaurants')
	.populate('activities').exec()
	.then(function(day){
		// day.hotel.prototype = Object.create(req.body.attraction);
		console.log("Daybruh",day);
		res.json(day);
	});
});

//Create a day!
router.post('/',function(req,res, next){
	console.log("request:",req.body);
	Day.create({
		number: req.body.number,
		hotel: null,
		restaurants: [],
		activities: [],
	})
	.then(function(day){
		res.json(day);
	})
	.then(null, next);
});
//Destroy it
router.delete('/:id',function(req,res){	
	// Day.findOne({_id: id})
});

//Add a hotel to a day!!!
router.post('/:id/hotel',function(req,res){
	var ourhotel;
	Hotel.find({_id :req.body.id}).exec()
	.then(function(hotel){
		ourhotel = hotel[0];
		return Day.findOne({number :req.params.id}).exec();
	}).then(function(day){
		day.hotel = ourhotel;
		day.save();
	})
});

//remove
router.delete('/:id/hotel',function(req,res){	});

//Add a restaurant to a day!!!
router.post('/:id/restaurant',function(req,res){
	var ourrestaraunt;
	Restaurant.find({_id :req.body.id}).exec()
	.then(function(restaurant){
		ourrestaraunt = restaurant[0];
		return Day.findOne({number :req.params.id}).exec();
	}).then(function(day){
		console.log('ourrest', ourrestaraunt);
		day.restaurants.push(ourrestaraunt)
		day.save();
	})
});
//remove
router.delete('/:id/restaurant',function(req,res){	});

//Add an activity to a day!!!
router.post('/:id/activity',function(req,res){
	var ouractivity;
	Activity.find({_id :req.body.id}).exec()
	.then(function(activity){
		ouractivity = activity[0];
		return Day.findOne({number :req.params.id}).exec();
	}).then(function(day){
		console.log('ourrest', ouractivity);
		day.activities.push(ouractivity);
		day.save();
	})
});
//remove
router.delete('/:id/activity',function(req,res){	});



module.exports = router;