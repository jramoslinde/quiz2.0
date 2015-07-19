var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
console.log(url);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var strorage = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd, { 
	dialect: protocol, 
	protocol: protocol,
	port: port,
	host: host,
	storage:strorage,
	omitNULL: true,
	ssl: true
});

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
			});
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa'
			}).success(function(){console.log('BD inicializada')});
		}
	});
});