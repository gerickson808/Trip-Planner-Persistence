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
	Day.findOne({_id:id}).exec()
	.then(function(day){
		res.json(day);
	});
});

//Create a day!
router.post('/',function(req,res){
	var day = new Day();
});
//Destroy it
router.delete('/:id',function(req,res){	});

//Add a hotel to a day!!!
router.post('/:id/hotels',function(req,res){});
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