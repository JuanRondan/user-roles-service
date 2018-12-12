import { userModel } from '../models/userSchema';
import { Document } from 'mongoose';

const users = {
    //GET ALL USERS
    getUsers: (req, res) => {
        userModel.find().exec((err, user) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json(user);
            }
        });
    },

    //GET ONE USER 
    getUserWithID: (req, res) => {
        if (req.params && req.params.userId) {        
            userModel.findById(req.params.userId).exec((err, user) => {
                if (err) {
                    res.status(500);
                    res.json(err);
                }
                if (!user) {
                    res.status(404);
                    res.json( { 'message': 'userId not found' } )
                }
                res.status(200);
                res.json(user);
            });
        } else {
            res.status(400);
            res.json({ 'message': 'bad request - missing parameter userId' })
        }
    },

    //CREATE NEW USER
    postUser: (req, res) => {
        if (req.body == '') {
        } else {
            var user = {
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "address": req.body.address,
                "phone": req.body.phone,
                "email": req.body.email,
                "roles": req.body.roles,
                "birthDate": req.body.birthDate,
            };
            userModel.create(user).then((doc: Document) => {
                res.status(200);
                res.json(doc);
            }).catch((err) => {
                res.status(500);
                res.json(err.message);
            });
        }
        return;
    },

    //UPDATE ONE USER
    putUser: (req, res) => {
        if (req.params.userId && req.body) {            
            let userID = { "_id": req.params.userId };
            userModel.findOneAndUpdate(userID, req.body, {new: true}).exec((err, user) => {
                if (err) {
                    res.status(500);
                    res.json(err);
                } 
                if (!user) {
                    res.status(404);
                    res.json({ 'message': 'userId not found' })
                }
                else {
                    res.status(200);
                    res.json(user);
                }
            })
        } else {
            res.status(400);
            res.json({ 'message': 'bad request - missing parameter userId' })
        }
    },

    //DELETE ONE USER
    deleteUser: (req, res) => {
        if (req.params.userId && req.body) {
            userModel.findByIdAndRemove(req.params.userId, req.body).exec((err, user) => {            
                if (err) {
                    res.status(500);
                    res.json(err);
                }
                if (!user) {
                    res.status(404);
                    res.json({ 'message': 'userId not found' })
                } else {
                    res.status(204);
                    res.json(null);
                }
            });
        } else {
            res.json(400);
            res.json({ 'message': 'bad request - missing parameter userId' })
        }
    }
}
export { users };