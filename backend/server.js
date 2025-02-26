const app = require('./app');

//const path=require('path');
const connectDatabase = require('./config/database');


connectDatabase();

const server= app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV}`)
});//Taking port details frpm config folder and using()=> checking the status of connection

//for Handling Unhandled Rejection error (if mongodb url is wrong in config.env, also see database)
//on(). it is event lisner function
process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection Error');
    //stopping the server
    server.close(()=>{
        //for closing the node too
        process.exit(1);
    })
})

//uncaught exception error
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception Error');
    //stopping the server
    server.close(()=>{
        //for closing the node too
        process.exit(1);
    })
})
//console.log(a); 