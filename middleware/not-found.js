const notFound = (req,res)=>res.status(404).send('Routes doesnot exist');

module.exports = notFound;