const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
    // throw new Error('testing async errors');

    
    const products = await Product.find({price:{$gt:30}}).select("name price");

    res.status(200).json({ products })
}
const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields , numericFilters} = req.query;

    const queryObject = {};

    if (featured) {
        // console,log(featured)
        queryObject.featured = featured === "true" ? true : false
        console.log(featured)
    }

    if (company) {
        queryObject.company = company;
    }

    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }

    if(numericFilters){
        const operatorMap={
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' :'$lte'
        }
        console.log(numericFilters)
        
        const regEx = /\b(<|>|>=|=|<|<=|)\b/g;
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        
        const options = ['price','rating'];

        filters = filters.split(",").forEach((item)=>{
            const [field,operator,value] = item.split("-")
            if(options.includes(field)){
                queryObject[field] = {[operator] : Number(value)}
            }
        })
        
    }


    // let result = Product.find(req.queryObject);
    let result = Product.find(queryObject);
    // sort
    if (sort) {
        const sortList = sort.split(",").join(" ")

        result = result.sort(sortList)
    } else {
        result = result.sort("createdAt");
    }

    if (fields) {
        const fieldsList = fields.split(",").join(" ")
        result = result.select(fieldsList)
    }

    // const page = Number(req.query.page) || 0;
    // const limit = Number(req.query.limit) || 10;

    // const skip = (page - 1) * limit;

    // result = result.skip(skip).limit(limit)

    const products = await result

    res.status(200).json({ products, Length: products.length })
}

const getSingleProduct = async (req,res)=>{
    const id = req.params.id
    const products = await Product.findOne({_id:id});

    res.status(200).json({products})
}


module.exports = {
    getAllProducts,
    getAllProductsStatic,
    getSingleProduct
}
