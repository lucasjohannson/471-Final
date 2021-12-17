'use strict';

const Hapi = require('@hapi/hapi');
const Path = require('path');

const start = async () => {

    const server = Hapi.server({
        port : 8080,
        debug:{
            request: "*",
            log:"*"
        },
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    });

    await server.register(require('@hapi/inert'));
    //home
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: Path.join(__dirname, 'public')
            }
        }
    });

    await server.register({
        plugin: require('hapi-plugin-mysql'),
        options: {
            host: "localhost",
            user: "root",
            password: "",
            insecureAuth: true,
            database: "471_DB"
        }
    });


   // login
    server.route({
        method: 'POST',
        path: '/api/user/login',
        handler: 
           async (request, h) => {
            //console.log("request", request.payload);
            const tester = await request.app.db.query(`

            SELECT * from Customer 
            WHERE username = ? 
                AND password = ?;
            
            `, [request.payload.username, request.payload.password]);


            if(tester[0]){
                return true;
            }else{
                return false;
            };

           }
        
    });
    //Profile Route
    server.route({
        method: 'GET',
        path: `/api/user/{userName}/allergies`,
        handler: 
            async (request, h) => {

            const tester = await request.app.db.query(`

                SELECT * from Allergy
                    left join (SELECT * from Customer_Allergy as CA
                        WHERE CA.Customer_username = ?) as target
                    on Allergy.allergy_name = target.Allergy_name;

            `,[request.params.userName]);


                let res = tester.map((r) => {

                    if(r.Customer_username !== null){

                            return {
                                "allergyName": r.allergy_name,
                                "hasAllergy" : true 
                            };
                    }else{
                        
                        return {
                            "allergyName": r.allergy_name,
                            "hasAllergy" : false 
                        };
                    };

                })

                return res;
        }
    });
    
    server.route({
        method: 'POST',
        path: `/api/user/{userName}/allergies`,
        handler: 
            async (request, h) => {

                let toUpdate = request.payload;
                const removeAllergy = await request.app.db.query(
                    `DELETE FROM Customer_Allergy WHERE Customer_username= ?;`, [request.params.userName]);

                 for(const elm of toUpdate){
                    const tmp = await request.app.db.query(`

                    INSERT INTO Customer_Allergy (Customer_username, Allergy_name) 
                    VALUES (?, ?);

                    `, [request.params.userName, elm]);

                 }
         
                return true;
            }
    });

    server.route({
        method: 'GET',
        path: `/api/user/{userName}/profile`,
        handler: 
            async (request, h) => {
                let uName = request.params.userName;

                const query = await request.app.db.query(`

                SELECT * from Profile
                    WHERE Profile.username = ?;

            `,[request.params.userName]);

                return {
                        "firstName":query[0].fname,
                        "lastName":query[0].lname,
                        "address": query[0].address
                    };
            }
    });

    server.route({
        method: 'GET',
        path: `/api/store/products`,
        handler: 
            async (request, h) => {
                const query = await request.app.db.query(`
                SELECT * FROM Inventory
                left join Inventory_Allergy IA on Inventory.ProductId = IA.Product_Id

                `);
        
                const inventory = new Map(); 

                for (let obj of query){
                    console.log(obj);
                    if (inventory.has(obj.ProductName)){
                        if (obj.Allergen){
                            inventory.get(obj.ProductName).allergens.push(obj.Allergen);
                        }
                    } 
                    else{
                        inventory.set(obj.ProductName, {
                            productName:obj.ProductName,
                            productId:obj.ProductId, 
                            productImage:obj.ProductImage,
                            price:obj.Price,
                            allergens: [obj.Allergen]});
                    }
                }

                return Array.from(inventory.values());
                    
            }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

start();