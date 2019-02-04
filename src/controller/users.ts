import { userModel } from '../models/userSchema';
import { Document } from 'mongoose';
import * as request from 'request';
const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
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
                "guid": req.body.guid,
                "address": req.body.address,
                "phone": req.body.phone,
                "email": req.body.email,
                "roles": req.body.roles,
                "birthDate": req.body.birthDate,
                "status": req.body.status,
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
    },

    // GET ALL CAMUNDA USER
    getUserListFromCamunda: (req, res) => {
        request({
            url: `${camundaIp}/user/`,
            method: "GET"
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error retrieving groups' });
                return;
            }
            res.status(200);
            res.json(JSON.parse(body));
        });
    },    
    // CREATE CAMUNDA USER
    createCamundaUser: (req, res) => {
        const payload = {
            "profile":
            {   
                "id": new Date().valueOf(),
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "email": req.body.email
            },
            "credentials":
                { "password": req.body.password }
        }
        request({
            url: `${camundaIp}/user/create`,
            method: "POST",
            json: payload
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            res.status(201);
            res.json(response);
        });
    },

    // UPDATE CAMUNDA USER
    updateCamundaUser: (req, res) => {
        const camundaUserId =  req.body.userId; 
        const payload = {   
                "id":  req.body.userId,
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "email": req.body.email
            }
        request({
            url: `${camundaIp}/user/${camundaUserId}/profile`,
            method: "PUT",
            json: payload
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            res.status(201);
            res.json(response);
        });
    },   
    
    // DELETE CAMUNDA USER
    deleteCamundaUser: (req, res) => {
        const camundaUserId = req.params.userId;
        request({
            url: `${camundaIp}/user/${camundaUserId}`,
            method: "DELETE"
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error retrieving groups' });
                return;
            }
            res.status(200);
            res.json(JSON.parse(body));
        });
    }
}
export { users };