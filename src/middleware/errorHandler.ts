export const errorHandler = (error, req, res, next) => {
    // if (error) {
    //     if(error.message === "This user could not be found in the database") {
    //         return res.status(404).json({
    //             success: false,
    //             message: "This user could not be found",
    //         })
    //     }

    //     // fallback error handler
    //     console.log(error)

    //     return res.status(500).json({
    //         success: false,
    //         message: "Uh oh, something went wrong on our side. Please try again.",
    //     })
    // }

    // return next()

    if (error) {
        return res.status(error.status).json({
            success: error.success || false,
            message: error.message,
        })
    }

    return next()
}

export const error404Handler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Not Found",
    })
}
