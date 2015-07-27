var models = require('../models/models.js');

exports.load = function (req, res, next, quizId){
	models.Quiz.find(quizId).then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		}
	}).catch(function(error){
		next(new Error('No existe quizId = '+ quizId));
	});
};

//GET /quizes
exports.index = function(req, res){
	if(req.query.search == null){
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index', {quizes: quizes});
		}).catch(function(error){new Error(error);})
	}else{
		models.Quiz.findAll({where: ["pregunta like %?%", req.query.search]}).then(function(quizes){
			res.render('quizes/index', {quizes: quizes});
		}).catch(function(error){new Error(error);})
	}
};

//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz})
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};