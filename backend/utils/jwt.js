const sendToken = (user, statusCode, res) => {

    //Creating JWT Token
    const token = user.getJwtToken();

    //setting cookies (this will not share token to js)
    const options = {
        expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRES_TIME  * 24 * 60 * 60 * 1000  //converting 7 days in milesec
            ),
        httpOnly: true,//JS cant access this and also it should be http
    }

    res.status(statusCode)
    .cookie('token', token, options)//cookie is key value pairs
    .json({
        success: true,
        token,
        user
    })


}

module.exports = sendToken;