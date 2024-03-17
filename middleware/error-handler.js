const errorHandlerMiddleware = async (err, req, res, next) => {
    console(err)
    return res.status(500).json({ msg: "Something went wrong, Please try agin later" })
}

module.exports = errorHandlerMiddleware;