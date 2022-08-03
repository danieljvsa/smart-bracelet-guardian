const knex = require('../database')


module.exports = {
     
    async get(req, res){
        let braces = []
        let id = []
        let names = []
        let response = []
        let brace_id = []

        await knex('bracelets').then((data) => {
            //console.log(data)
            for (let index = 0; index < data.length; index++) {
                braces.push(data[index].macAddress)
                id.push(data[index].profileId)
                brace_id.push(data[index].braceletId)
                
            }
        })
        
        for (let index = 0; index < id.length; index++) {
            //console.log(id[index])
            await knex('profiles').where({profileId: id[index]}).then((data) => {
                if( data[0].profileName != undefined){
                    names.push(data[0].profileName)
                }
            })
            
        }

        for (let index = 0; index < names.length; index++) {
            response.push({id: brace_id[index], name: names[index], macAddress: braces[index]})
        }
        console.log(response)
        res.status(200).send(response)
    },
    async create(req, res, next){
        try {
            const {macAddress, username} = req.body
            let id = 0
            if(username != ""){
                await knex('profiles').where({
                    profileName: username,
                }).then((data) => {
                    console.log(data)
                    id = data[0].profileId
                    ///console.log(data)
                })
            } else{
                return res.status(400).send("Patient name was not valid.")
            }
            if(id != 0 && id != null){
                let MACRegex = new RegExp("^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$");
                //MACRegex.test(macAddress);
                const macs = await knex('bracelets').where({
                    macAddress: macAddress,
                })
                //console.log(MACRegex.test(macAddress))
                if(macs.length >= 1 || MACRegex.test(macAddress) != true){
                    return res.status(400).send("Mac Address is already in use or is not valid.")
                }else{
                    await knex('bracelets').insert({
                        macAddress: macAddress,
                        profileId: id
                    })
    
                    return res.status(201).send('Bracelet is ' + macAddress + '  connected.')
                }
                
            } else {
                return res.status(400).send('Bracelet  ' + macAddress + ' was not connected.')
            }

            
        } catch (error) {
            next(error)
        }
    },

    async update(req, res, next){
        try {
            const {username, macAddress} = req.body
            const {id} = req.params
            let profileId = 0
            if(username != "" && macAddress != "" && id != ""){
                
                let profile = await knex('profiles').where({
                    profileName: username
                })
                profileId = profile[0].profileId
                //console.log(profile[0].profileId)
                if(profileId != 0){
                    let MACRegex = new RegExp("^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$");
                    const macs = await knex('bracelets').where({
                        macAddress: macAddress,
                    })
                    if(macs.length >= 1 || MACRegex.test(macAddress) != true){
                        return res.status(201).send("Mac Address is already in use or is not valid.")
                    }else{
                        await knex('bracelets').update({
                            macAddress: macAddress,
                            profileId: profileId
                        }).where({
                            braceletId: id
                        })
                        return res.status(200).send('Bracelet updated')
                    }
                }else{
                    return res.status(400).send('Profile Id not identified.')
                }
                
                
                
                
            } else {
                return res.status(400).send('Data was not inserted.')
            }
            

            
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },

    async delete(req, res, next){
        try {
            const {id} = req.params

            if(id != ""){
                await knex('bracelets').where({
                    braceletId: id
                }).del()

                return res.status(200).send('Bracelet deleted.')
            } else {
                return res.status(400).send('Id was not valid.')
            }
        } catch (error) {
            next(error)
        }
    }
    
}