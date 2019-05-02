module.exports = {
    MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/proj',

    REDIS_URL: process.env.REDIS_URL || null,

    TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',

    API_PORT: process.env.PORT || 3001
}