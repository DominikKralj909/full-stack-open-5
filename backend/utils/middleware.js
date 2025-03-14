const User = require('../models/user');
const logger = require('./logger');

const jwt = require('jsonwebtoken');

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next();
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '');
    } else {
        request.token = null;
    }

    next();
};

const userExtractor = async (request, response, next) => {
    const { token } = request;
    console.log("Token received:", token);

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        console.log("Decoded token:", decodedToken);

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' });
        }

        request.user = await User.findById(decodedToken.id);
        if (!request.user) {
            return response.status(401).json({ error: 'user not found' });
        }

        next();
    } catch (error) {
        console.log("Error decoding token:", error);
        return response.status(401).json({ error: 'token invalid' });
    }
};

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor }

