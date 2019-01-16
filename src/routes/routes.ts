import * as express from 'express';
import { users } from '../controller/users';
import { role } from '../controller/roles';
import { camunda } from '../controller/camunda';

const router = express.Router();
//const app: express.Express = express();

// -----------USERS ROUTES-----------//
router.get('/users', users.getUsers);
router.get('/users/:userId', users.getUserWithID);
router.post('/users', users.postUser);
router.put('/users/:userId', users.putUser);
router.delete('/users/:userId', users.deleteUser);

// -----------ROLE ROUTES-----------//
router.get('/roles', role.getRoles);
router.get('/roles/:roleId', role.getRoleWithID);
router.post('/roles', role.postRole);
router.put('/roles/:roleId', role.putRole);
router.delete('/roles/:roleId', role.deleteRole);

//----------CAMUNDA ROUTES-----------//
router.get('/camunda/:userId', camunda.getRequests);
router.post('/camunda', camunda.initiateRequest);
router.post('/camunda/:taskId/approve', camunda.approveRequest);
router.post('/camunda/:taskId/reject', camunda.rejectRequest);

//test alive
router.get('/ping', (req, res)=>{
    res.json("pong");
    return;
});

export { router };