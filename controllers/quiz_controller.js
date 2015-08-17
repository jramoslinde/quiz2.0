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
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error){new Error(error);})
	}else{
		models.Quiz.findAll({where: ["pregunta like ?", '%'+req.query.search+'%']}).then(function(quizes){
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error){new Error(error);})
	}
};

//GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz, errors: []})
};

//GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function (req, res){
	var quiz = models.Quiz.build(req.body.quiz);
	var val = quiz.validate();

	if(val){
		res.render('quizes/new', {quiz: quiz, errors:'Campos obligatorios'})
	}else{
		quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
		res.redirect('/quizes');})
	}
}; 

//POST /quizes/:id/edit
exports.edit = function (req, res){
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors:[]})
};

//PUT /quizes/:id
exports.update = function (req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var val = req.quiz.validate();

	if(val){
		res.render('quizes/edit', {quiz: req.quiz, errors:'Campos obligatorios'})
	}else{
		req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
		res.redirect('/quizes');})
	}
}; 

//DELETE /quizes/:id
exports.destroy = function (req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};