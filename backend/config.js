module.exports = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/proj',

    TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',

    API_PORT: process.env.API_PORT || 3001
}