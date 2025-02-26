//searching separate product or keyword
class APIFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    //search functionality
    search(){
        let keyword =this.queryStr.keyword ?{
            name:{
                $regex:this.queryStr.keyword,// mongoDB query operator is regex
                $options:'i',//this property will upper/lower case(insense) it will match keyword .mongoDB query 
                
            }
        }:{};//if there is no keyword in api it gives empty object

        //
        this.query = this.query.find({...keyword});
        return this;//return above function for future changes
    }

    //filter
    filter(){
        const queryStrCopy={...this.queryStr};
        //removing fields from query (notion 1.1.)
        const removeFields=['keyword','limit','page'];
        removeFields.forEach(field=>delete queryStrCopy[field]);

        //price filter with mongodb query operator $lt,$gt
        let queryStr=JSON.stringify(queryStrCopy);//this is string
        // regular expression(/\b(charcters)/)
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)/g,match=>`$${match}`);//converting string to mongodb query
        //console.log(queryStr);

        //filtering product based on query
        this.query = this.query.find(JSON.parse(queryStr));
        return this;//return above function for future changes

    }

    //page per 
    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;//queryStr in construtor
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }    
        


}

module.exports=APIFeatures;//this going to productController.js