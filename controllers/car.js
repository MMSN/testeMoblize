const Car = require('../models/car');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.getCars = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    let query = {}, sortFinal = {};
    if (req.query.model) {
        //query = {'model': req.query.model};
        query['model'] = req.query.model;
    } 
    if (req.query.category) {
        //query = {'color': req.query.color};
        query['category'] = req.query.category;
    }  
    if (req.query.color) {
        //query = {'color': req.query.color};
        query['color'] = req.query.color;
    }
    if (req.query.sortBy) {
        let sortQuery = req.query.sortBy;
        let aux = {};
        if (! req.query.orderBy) {
            aux[sortQuery] = 1;
        }
        else {
            let value;
            if (req.query.orderBy === 'desc') {
                value = -1;
            }
            else {
                value = 1;
            }
            //let order = req.query.orderBy;
            aux[sortQuery] = value;
        }
        sortFinal['sort'] = aux;
    }
    //console.log(sortFinal);
    //console.log(query);
    //todos os carros
    //{sort: {'model': -1}}
    Car.find(query, null, sortFinal)
      .countDocuments()
      .then(count => {
        totalItems = count;
        return Car.find(query, null, sortFinal).select('-rents')
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

exports.simulationCar = (req, res, next) => {
    const query = req.query;
    console.log(query);

    Car.findOne({'model': query.model})
      .then(car => {
        if (!car) {
            const error = new Error('Modelo de carro nao encontrado!');
            error.statusCode = 404;
            throw error;
        }
        let total, totalValue;
        const category = car.category;
        if (category === "padrao") {
            total = 99.99;
        } else if (category === "executivo") {
            total = 199.99;
        } else {
            total = 350;
        }
        totalValue = total * query.duration;
        //console.log("Encontrado"+totalValue, total);
        res.status(200).json({
            message: 'Carro encontrado!', 
            model: car.model,
            category: car.category,
            totalValue: totalValue
        });
      })
      .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
      });

}