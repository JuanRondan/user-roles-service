import { roleModel } from '../models/roleSchema';
import { Document } from 'mongoose';
import { userModel } from '../models/userSchema';
import * as request from 'request';

const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
const role = {

    //------------------------------------LOCAL DB-----------------------------------------------

    //GET ALL ROLES
/*     getRoles: (req, res) => {
        roleModel.find().exec((err, role) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json(role);
            }
        });
    }, */

    //GET ONE ROLE
    /* getRoleWithID: (req, res) => {
        if (!req.params || req.params.roleId == '') {
            console.log(req.err.message);
        } else {
            roleModel.findById(req.params.roleId).exec((err, role) => {
                if (err) {
                    res.send(err.message);
                    return;
                }
                res.json(role);
            });
        }
    }, */

    //CREATE NEW ROLE
/*     postRole: (req, res) => {
        if (req.body == '') {
            console.log(req.err.message);
        } else {
            console.log(req.body);
            var role = {
                "name": req.body.name,
                "description": req.body.description,
                "permissions": req.body.permissions,
            }
            roleModel.create(role).then((doc: Document) => {
                res.status(200);
                res.json(doc);
            }).catch((err) => {
                res.status(500);
                res.json(err.message);
                console.log(err);
            });

        }
        return;
    }, */

    //UPDATE ONE ROLE
/*     putRole: (req, res) => {

        if (!req.params.roleId || req.body == '') {
            console.log(req.err.message);
        } else {
            let roleID = { "_id": req.params.roleId };
            roleModel.findOneAndUpdate(roleID, req.body).exec((err, roleData) => {
                if (err) {
                    res.status(500);
                    res.json(err);

                } else {
                    res.status(200);
                    res.json(roleData);
                }
            })
        };
    }, */

    //DELETE ONE ROLE
/*     deleteRole: (req, res) => {

        roleModel.findByIdAndRemove(req.params.roleId, req.body).exec((err, role) => {
            if (!req.params.roleId || req.body == '') {
                console.log(req.err.message);
            } else {
                if (err) {
                    res.status(500);
                    res.json(err);

                } else {
                    let wipeRole = function () {
                        try {
                            userModel.find((err, users: any) => {
                                for (let i = 0; i < users.length; i++) {
                                    //const element = array[i];
                                    let index = users[i].roles.indexOf(req.params.roleId);
                                    if (index > -1) {
                                        users[i].roles.splice(index, 1);
                                        userModel.findByIdAndUpdate(users[i]._id, users[i]).exec().catch((err) => { });
                                    }
                                }
                                console.log(users);

                            });
                        }
                        catch (err) {
                            console.log('Error: ', err.message);
                        }
                    }
                    wipeRole();
                    res.status(200);
                    res.json(role);
                }

            }
        });
    }, */

    //------------------------------------CAMUNDA-----------------------------------------------
    createRoleInCamunda: (req, res) => {
        const payload = {
            "id": req.body.id,            
            "name": req.body.name,
            "type": req.body.type            
        }
        console.log("starting request with ", payload);
        request({
            url: `${camundaIp}/group/create`,
            method: "POST",
            json: payload
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            console.log("body: ", body);
            res.status(201);
            res.json(body);
        });
    },

    getRolesFromCamunda: (req, res) => {
        const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
        //const prefix = "%POC%";

        request({
            //url: `${camundaIp}/group/?nameLike=${prefix}`,
            url: `${camundaIp}/group/`,
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

    updateRoleInCamunda: (req, res) => {      

        const payload = {
            "id": req.body.id,
            "name": req.body.name,
            "type": req.body.type            
        }
        
        request({
            url: `${camundaIp}/group/${req.body.id}`,
            method: "PUT",
            json: payload
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            res.status(204);
            res.json(response);
        });
    },

    deleteRoleInCamunda: (req, res) => {
        request({
            url: `${camundaIp}/group/${req.params.roleId}`,
            method: "DELETE"
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            console.log("request ok " + req.params.roleId);
            res.status(204);
            res.json(body);
        });
    }

}
export { role };