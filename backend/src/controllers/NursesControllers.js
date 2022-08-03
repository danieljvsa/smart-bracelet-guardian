const knex = require('../database')


module.exports = {
    
    async get(req, res){
        knex('nurses').then((data) => {
            res.status(200).send(data)
        })
    },
    async create(req,res, next){
        try {
            const {username, phone, division} = req.body

            if(division != 'front' && division != "end"){
                return res.status(400).send('Division option not valid.')
            }

            if(username != '' && phone != '' && division != ''){
                const names = await knex('nurses').where({nurseName: username})
                const phones = await knex('nurses').where({phone: phone})
                if(names.length >= 1 || phones.length >= 1){
                    return res.status(200).send('Name or Phone number is already in use.')
                } else {
                    await knex('nurses').insert({
                        nurseName: username,
                        phone: phone,
                        division: division
                    })
        
                    return res.status(201).send('Nurse ' + username + ' added.')
                }
                
            } else {
                return res.status(400).send('Data not valid.')
            }
            
            
        } catch (error) {
            next(error)
        }
    },

    async update(req, res, next){
        try {
            const {username, phone, division} = req.body
            const {id} = req.params

            if(division != 'front' && division != "end"){
                return res.status(400).send('Division option not valid.')
            }

            if(username != '' && phone != '' && division != ''){
                const phones = await knex('nurses').where({phone: phone})
                if(phones.length >= 1){
                    return res.status(400).send('Phone number is already in use.')
                } else {
                    await knex('nurses').update({
                        nurseName: username,
                        phone: phone,
                        division: division
                    }).where({
                        nurseId: id
                    })
    
                    return res.status(200).send('Nurse updated')
                }
                
            } else {
                return res.status(400).send('Data not valid.')
            }
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next){
        try {
            const {id} = req.params
            if(id == ''){
                return res.status(400).send('Id is invalid.') 
            } else{
                await knex('nurses').where({
                    nurseId: id
                }).del()
    
                return res.status(200).send('Nurse deleted')
            }
            

        } catch (error) {
            next(error)
        }
    }
}

