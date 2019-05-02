'use strict';

const redis = require('redis');
const Config = require('../config');

const retrySgy = function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        console.log("Redis connection error");
        return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
}

exports.init = function(){
    let redisClient = redis.createClient({retry_strategy: retrySgy, url: Config.REDIS_URL});

    redisClient.on('connect', ()=>console.log("REDIS:", "connected to redis host."));
    redisClient.on('error', err=>console.log("REDIS ERROR:", err));   
}

exports.getRedis = function(){
    return redisClient;
}
