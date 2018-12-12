import { users } from '../controller/users'
import { role } from '../controller/roles'

const express = require('express');
const router = express.Router();

// -----------USERS ROUTES-----------//

//GET ALL USER
router.get('/users', users.getUsers);

//GET ONE USER
router.get('/users/:userId', users.getUserWithID);

//POST NEW USER
router.post('/users', users.postUser);

//UPDATE USER
router.put('/users/:userId', users.putUser);

//DELETE USER
router.delete('/users/:userId', users.deleteUser);

// -----------ROLE ROUTES-----------//

//GET ALL ROLES
router.get('/roles', role.getRoles);

//GET ONE ROLE
router.get('/roles/:roleId', role.getRoleWithID);

//POST NEW ROLE
router.post('/roles', role.postRole);

//UPDATE ROLE
router.put('/roles/:roleId', role.putRole);

//DELETE ROLE
router.delete('/roles/:roleId', role.deleteRole);

//test alive
router.get('/ping', (req, res)=>{
    res.json("pong");
    return;
});

export { router };