export const errorHandler = (error, req, res, next) => {
    if (error) {
        return res.status(error.status).json({
            success: error.success || false,
            message: error.message,
        });
    }

    return next()
}

export const error404Handler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Not Found",
    })
}
