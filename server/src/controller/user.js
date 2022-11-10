const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const signUp = async (req,res) => {
    try {
        const {name , email , password , subject ,marks} = req.body;

        if(Object.keys(req.body).length == 0) return res.status(400).send({message:'please enter data'});

        if(!name) return res.status(400).send({message:'please enter name'});
        if(!email) return res.status(400).send({message:'please enter email'});
        if(!password) return res.status(400).send({message:'please enter password'});
        if(!subject) return res.status(400).send({message:'please enter password'});
        if(!marks) return res.status(400).send({message:'please enter password'});

        const user = await userModel.findOne({email});

        if(user) return res.status(400).send({message:'you are already registerd'});
        
        const data = await userModel.create(req.body);
        
        return res.status(201).send({message:'user created', data}); 
        
    } catch (error) { return res.status(500).send({message:error})}
}

const login = async (req,res) => {
    try {
        const {email , password} = req.body;

        if(Object.keys(req.body).length == 0) return res.status(400).send({message:'please enter data'});

        if(!email) return res.status(400).send({message:'please enter email'});
        if(!password) return res.status(400).send({message:'please enter password'});

        let user = await userModel.findOne({email , password});
        
        if(!user) return res.status(401).send({message:'invalid credentials'});

        let token = jwt.sign({_id:user._id} , 'sfiocsdoncxovweifmsfm',{expiresIn:'1d'});

        return res.status(200).send({message:'login',token});
        
    } catch (error) { return res.status(500).send({message:error})}
}

const getUser = async (req,res) => {
    try{
        const {name ,subject , ...abc} = req.query;

        if(Object.keys(abc).length !== 0) return res.status(400).send({message:`you can't filter to this value`});
        
        if(name){
            const data = await userModel.find({name });

            if(data.length === 0) return res.status(404).send({message:'Not found'}); 

            return res.status(200).send({message:'all user',data});
        }

        if(subject){
            const data = await userModel.find({subject });

            if(data.length === 0) return res.status(404).send({message:'Not found'}); 

            return res.status(200).send({message:'all user',data});
        }
       
        const data = await userModel.find();

        if(data.length === 0) return res.status(404).send({message:'Not found'}); 

        return res.status(200).send({message:'all user',data});

    } catch (error) { return res.status(500).send({message:error})}
}


const userUpdate = async (req,res) => {
    try {
        const userID = req.params.id;

        const {marks} = req.body;

        if(!mongoose.isValidObjectId(userID)) return res.status(400).send({message:'enter valid id'});

        const user = await userModel.findById(userID);

        if(!user) return res.status(404).send({message:'user not found'});

        if(marks) {
            req.body.marks = marks + user.marks;
            const data = await userModel.findOneAndUpdate({_id:userID},req.body , {new : true});
            return res.status(200).send({message:'updated' ,data});
        }

        const data = await userModel.findOneAndUpdate({_id:userID},req.body , {new : true});
        return res.status(200).send({message:'updated' ,data});

    } catch (error) { return res.status(500).send({message:error})}
}

const userDelete = async (req,res) => {
    try {
        const userID = req.params.id;

        if(!mongoose.isValidObjectId(userID)) return res.status(400).send({message:'enter valid id'});

        const user = await userModel.findById(userID);

        if(!user) return res.status(404).send({message:'user not found'});

        await userModel.findByIdAndDelete(userID);

        return res.status(200).send({message:'user deleted.'})

    } catch (error) { return res.status(500).send({message:error})}
}

module.exports = { signUp , login , getUser , userUpdate , userDelete};