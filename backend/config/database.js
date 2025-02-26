const mongoose=require('mongoose');//connecting with database

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,//new parser using so this and below 
        useUnifiedTopology:true,
    }).then(e=>{
        console.log(`MongoDB is connected to the host:${e.connection.host}`);
    })
}

module.exports=connectDatabase;


