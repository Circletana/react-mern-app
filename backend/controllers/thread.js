const Thread = require('../models/thread');

exports.getAllThreads = function(req, res){
    let filter = {};
    if(req.query.search && req.query.search != "")
        filter = { $text: { $search: req.query.search}};
    Thread.find(filter).populate('user').exec((err, threads)=>{
        if(err){
            console.log(err);
            return res.json({status:"error", message:"Error loading threads"});
        }
        return res.json({status:"success", message:"Loading threads...", data:threads});
    });
}

exports.createNewThread = function(req, res){
    let thread = new Thread({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags.split(" "),
        user: req.user
    });

    thread.save(err=>{
        if(err){
            console.log(err);
            return res.json({status:"error", message:err.message});
        }
        return res.json({status:"success", message:"Thread created", data:thread});
    })

}