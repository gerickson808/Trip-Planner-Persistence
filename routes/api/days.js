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
	Day.findOne({number:id}).exec()
	.then(function(day){
		console.log(day);
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
router.post('/:id/hotels',function(req,res){
	var ourhotel;
	Hotel.find({name:req.body.name}).exec()
	.then(function(hotel){
		ourhotel = hotel;
		return Day.findOne({_id:req.params.id}).exec();
	}).then(function(day){
		day.hotel = ourhotel._id;
	});
});

//remove
router.delete('/:id/hotels',function(req,res){	});

//Add a restaurant to a day!!!
router.post('/:id/restaurants',function(req,res){});
//remove
router.delete('/:id/restaurants',function(req,res){	});

//Add an activity to a day!!!
router.post('/:id/activities',function(req,res){});
//remove
router.delete('/:id/activities',function(req,res){	});



module.exports = router;