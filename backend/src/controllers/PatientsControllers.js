const knex = require('../database')
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = {
     
    async get(req, res){
        const {id} = req.params
        await knex('patient_data').where({profileId: id}).orderBy('dataId', 'desc').then((data) => {
            res.status(200).send(data)
        })
    },
    async create(req, res, next){
        let isValid = false
        let id = 0
        let patientName = ''
        let phones = []
        try {
            const {battery, macAddress, distance, address} = req.body
            //const {id} = req.params
            let MACRegex = new RegExp("^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$");
            if(macAddress != '' || MACRegex.test(macAddress) === true){
                await knex('bracelets').where({macAddress: macAddress}).then((data) => {
                    console.log(data)
                    if(data[0] != undefined){
                        if(data[0].braceletId != 0){
                            isValid = true
                            id = data[0].profileId
                        } else{
                            res.status(400).send('Bracelet is not valid.')
                        }
                    }                     
                })
            } else {
                return res.status(400).send("Patient name was not valid.")
            }

            if(isValid != false){
                if(distance != '' && battery != '' && id != '' && address != ''){
                    
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var time = (today.getHours()+1) + ":" + today.getMinutes() + ":" + today.getSeconds();
                    
                    await knex('profiles').where({profileId: id}).then((data) => {
                        patientName = data[0].profileName
                    })

                    await knex('nurses').then((data) => {
                        console.log(data)
                        for (let index = 0; index < data.length; index++) {
                            client.messages.create({
                                body: 'Alert: ' + patientName + ' has fallen at ' + time + ' of ' + date + ' at ' + distance + ' meters from antena. Its room ' + address + '.',
                                from: 'whatsapp:' + process.env.TWILIO_WHATSAPP ,
                                to: 'whatsapp:' + data[index].phone
                            }).then().done();
                            
                        }
                    })

                    await knex('patient_data').insert({
                        distance: distance,
                        address: address,
                        created_at: today,
                        profileId: id
                    })
                    
                   

                    await knex('profiles').where({profileId: id}).update({
                        battery: battery
                    })

                    
                    
                    return res.status(200).send('Alert to nurses was sent!!')
                }
                
            } else {
                return res.status(500).send('Information is not valid.')
            }
            

            
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next){
        try {
            const {id} = req.params
            if(id != ''){
                await knex('patient_data').where({
                    dataId: id
                }).del()
    
                return res.status(200).send('Alert deleted')
            } else{
                return res.status(400).send('Alert was not deleted')
            }
            

        } catch (error) {
            next(error)
        }
    }, 
    async test(req,res, next){
        let {message_received} = req.body;

        try {
            return res.status(200).end(`Welcome ESP32, the message you sent me is:` + message_received);
        } catch (error) {
            return res.status(400).end('Error: ' + error);
        }
		
    }, 
    async test_create(req,res,next){
        let isValid = false
        let id = 0
        let patientName = ''
        //let distance = "1.00"
        try {
            const {battery, macAddress, distance, address} = req.body
            //const {id} = req.params
            let MACRegex = new RegExp("^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$");
            if(macAddress != '' || MACRegex.test(macAddress) === true){
                await knex('bracelets').where({macAddress: macAddress}).then((data) => {
                    console.log(data)
                    if(data[0] != undefined){
                        if(data[0].braceletId != 0){
                            isValid = true
                            id = data[0].profileId
                        } else{
                            res.status(400).send('Bracelet is not valid.')
                        }
                    }                     
                })
            } else {
                return res.status(400).send("Patient name was not valid.")
            }

            if(isValid != false){
                if(distance != '' && battery != '' && id != '' && address != ''){
                    
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var time = (today.getHours()+1) + ":" + today.getMinutes() + ":" + today.getSeconds();
                    
                    await knex('profiles').where({profileId: id}).then((data) => {
                        patientName = data[0].profileName
                    })

                    await knex('nurses').then((data) => {
                        console.log(data)
                        for (let index = 0; index < data.length; index++) {
                            client.messages.create({
                                body: 'Alert: ' + patientName + ' has fallen at ' + time + ' of ' + date + ' at ' + distance + ' meters from antena. Its room ' + address + '.',
                                from: 'whatsapp:' + process.env.TWILIO_WHATSAPP ,
                                to: 'whatsapp:' + data[index].phone
                            }).then().done();
                            
                        }
                    })

                    await knex('patient_data').insert({
                        distance: distance,
                        address: address,
                        created_at: today,
                        profileId: id
                    })
                    
                   

                    await knex('profiles').where({profileId: id}).update({
                        battery: battery
                    })

                    
                    
                    return res.status(200).send('Alert to nurses was sent!!')
                }
                
            } else {
                return res.status(500).send('Information is not valid.')
            }
            

            
        } catch (error) {
            next(error)
        }
    },
    async false_alert(req,res,next) {
        try {
            const {macAddress} = req.body
            let id = ''
            let name = ''
            await knex('bracelets').where({
                macAddress: macAddress
            }).select('profileId').then((data) => {
                id = data[0].profileId
            })

            await  knex('profiles').where({
                profileId: id
            }).select('profileName').then((data) => {
                name = data[0].profileName
            })

            await knex.raw('DELETE FROM patient_data WHERE profileId = ' + id + ' ORDER BY dataId DESC LIMIT 1')
            
            await knex('nurses').then((data) => {
                for (let index = 0; index < data.length; index++) {
                    client.messages.create({
                        body: 'Alert: ' + name + ' has not fallen. False alert detected.',
                        from: process.env.TWILIO_WHATSAPP ,
                        to: data[index].phone
                    }).then().done();
                }
            })
            return res.send('Alert deleted')

        } catch (error) {
            next(error)
        }
    },
    async false_alert_test(req,res,next) {
        try {
            const {macAddress} = req.body
            let id = ''
            let name = ''
            await knex('bracelets').where({
                macAddress: macAddress
            }).select('profileId').then((data) => {
                id = data[0].profileId
            })

            await  knex('profiles').where({
                profileId: id
            }).select('profileName').then((data) => {
                name = data[0].profileName
            })

            await knex.raw('DELETE FROM patient_data WHERE profileId = ' + id + ' ORDER BY dataId DESC LIMIT 1')
            
            await knex('nurses').then((data) => {
                for (let index = 0; index < data.length; index++) {
                    client.messages.create({
                        body: 'Alert: ' + name + ' has not fallen. False alert detected.',
                        from: 'whatsapp:' + process.env.TWILIO_WHATSAPP ,
                        to: 'whatsapp:' + data[index].phone
                    }).then().done();
                }
            })
            return res.send('Alert deleted')

        } catch (error) {
            next(error)
        }
    }

    
}