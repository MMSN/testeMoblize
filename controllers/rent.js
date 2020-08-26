const Rent = require('../models/rent');
const Car = require('../models/car');
const User = require('../models/user');

const mongoose = require('mongoose');
const moment = require('moment');
const rent = require('../models/rent');
const Schema = mongoose.Schema;

exports.postRent = async (req, res, next) => {
    //infos
    const car = req.body.car;
    const begindate = req.body.begindate;
    const duration = req.body.duration;
    let newDate;
    //console.log(begindate);
    newDate = moment(begindate).format();
    //console.log(newDate);
    const endingdate = moment(newDate).add(duration, 'days').format();
    //console.log(endingdate);
    //console.log(moment(Date(begindate)).add(duration, 'days'));
    //const endingdate = moment(begindate).add(duration, 'days').format();
    
    let available, category, totalValue, total, vetorRents;
    //recuperar o carro
    await Car.findOne({'_id': { $in: car}}, function(err, found) {
        if (found) {
            category = found.category;
            vetorRents = found.rents;
            //vendo disponibilidade
            //vetorRents.forEach(element => {
                const answer = checkDate(newDate, endingdate, vetorRents)
                    .then(value => {
                    if (value == false) {
                        if (category === "padrao") {
                            total = 99.99;
                        } else if (category === "executivo") {
                            total = 199.99;
                        } else {
                            total = 350;
                        }
                        totalValue = total * duration;
                        
                        const rent = new Rent({
                            client: req.userId,
                            car: car,
                            begindate: newDate,
                            endingdate: endingdate,
                            duration: duration, 
                            price: totalValue
                        });
                        rent
                        .save()
                        //encontrar o usuario
                        .then(result => {
                            return User.findById(req.userId)
                        })
                        //colocar no vetor de navers
                        .then(user => {
                            user.rents.push(rent);
                            return user.save();
                        })
                        .then(result => {
                            return Car.findById(car)
                        })
                        .then(car => {
                            car.rents.push(rent);
                            return car.save();
                        })
                        .then(result => {
                            res.status(201).json({
                                message: 'Aluguel criado com sucesso.',
                                rent: rent
                                //creator: { _id: creator._id, email: creator.email}
                            });
                        })
                        .catch(err => {
                            if (!err.statusCode) {
                                err.statusCode = 500;
                            }
                            next(err);
                        })
                    } else {
                        res.status(500).json({
                        message: "Nao e possivel alugar o carro: nao esta disponivel."
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            //});
        }
        else {
            res.status(500).json({
                message: "Nao e possivel alugar o carro: carro nao existente."
            });
        }
    });
}

checkDate = async (dateInicio, dateFinal, rents) => {
    let inside = false;
    //rents.forEach(element =>{
    for (const element of rents) {
        const erent = await Rent.findOne({'_id': { $in: rents}}, function(err, found){
            console.log(found.begindate, found.endingdate, dateInicio, dateFinal);
            let d1, start, end, d2;
            d1 = new Date(found.begindate).setHours(0,0,0,0);
            //console.log(d1);
            start = new Date(dateInicio).setHours(0,0,0,0);
            //console.log(start);
            end = new Date(dateFinal).setHours(0,0,0,0);
            //console.log(end);
            d2 = new Date(found.endingdate).setHours(0,0,0,0);
            //console.log(((d1 < start) && (start < d2)) || ((d1 < end) && (end < d2)));
            inside = (((d1 <= start) && (start <= d2)) || ((d1 <= end) && (end <= d2)));
            console.log("inside "+inside);
        });
    };
    //});
    return inside;
}
