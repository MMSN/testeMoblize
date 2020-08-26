const Car = require('../models/car');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.getCars = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    //todos os cars
    Car.find()
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Car.find().select('-rents')
          .skip((currentPage - 1) * perPage)
          .limit(perPage)
      })
      .then(cars => {
          res
            .status(200)
            .json({
                message: 'Carros encontrados com sucesso', 
                cars: cars,
                totalItems: totalItems
            });
      })
      .catch(err => {
          if (!err.statusCode) {
              err.statusCode = 500;
          }
          next(err);
      });
}

exports.getCar = (req, res, next) => {
    const carId = req.params.carId;
    Car.findById(carId).populate()
        .then(car => {
            if (!car) {
                const error = new Error('ID de carro nao encontrado!');
                error.statusCode = 404;
                throw error;
            }
            //console.log("Encontrado"+car);
            res.status(200).json({message: 'Carro encontrado!', car: car});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    //}
    //else {
    //    res.status(404).json({message: 'ID entrado nao e valido!'});
    //}
};

exports.postCar = async (req, res, next) => {
    //infos
    const model = req.body.model;
    const vrplate = req.body.vrplate;
    const color = req.body.color;
    const observation = req.body.observation;
    const category = req.body.category;
    //criar
    const car = new Car({
        model: model,
        vrplate: vrplate,
        color: color,
        observation: observation,
        category: category
    });
    car
        .save()
        .then(result => {
            //console.log("Adicionado"+result);
            res.status(201).json({
                message: "Carro adicionado com sucesso!",
                car: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};