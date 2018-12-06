import { roleModel } from '../models/roleSchema';
import { Document } from 'mongoose';

const role = {

    //GET ALL ROLES
    getRoles: (req, res) => {
        roleModel.find().exec((err, role) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json(role);
            }
        });
    },


    //GET ONE ROLE 
    getRoleWithID: (req, res) => {
        if (!req.params || req.params.roleId == '') {
            console.log(req.err.message);
        } else {
            roleModel.findById(req.params.roleId).exec((err, role) => {
                if (err) {
                    res.send(err.message);
                }
                res.json(role);
            });
        }
    },

    //CREATE NEW ROLE
    postRole: (req, res) => {
        if (req.body == '') {
            console.log(req.err.message);
        } else {
            console.log(req.body);
            var role = {
                "name": req.body.name,
                "description": req.body.description
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
    },

    //UPDATE ONE ROLE
    putRole: (req, res) => {

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
    },

    //DELETE ONE ROLE
    deleteRole: (req, res) => {

        roleModel.findByIdAndRemove(req.params.roleId, req.body).exec((err, role) => {
            if (!req.params.roleId || req.body == '') {
                console.log(req.err.message);
            } else {
                if (err) {
                    res.status(500);
                    res.json(err);

                } else {
                    res.status(200);
                    res.json(role);
                }

            }
        });
    }

}
export { role };