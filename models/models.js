var path = require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null, { dialect: "sqlite", storage:"quiz.sqlite"});

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;

//sequelize.sync() crea e inicializa la  tabla de preguntas BBDD
sequelize.sync().success(function (){
	Quiz.count().success(function(count){
		if(count === 0){
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma'
			}).success(function(){console.log('BD inicializada')});
		}
	});
});