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
/* router.get('/roles', role.getRoles);
router.get('/roles/:roleId', role.getRoleWithID);
router.post('/roles', role.postRole);
router.put('/roles/:roleId', role.putRole);
router.delete('/roles/:roleId', role.deleteRole); */
// -----------Camunda Roles routes-----------------//
router.get('/roles/camunda', role.getRolesFromCamunda);
router.post('/roles/camunda', role.createRoleInCamunda);
router.put('/roles/camunda/:roleId', role.updateRoleInCamunda);
router.delete('/roles/camunda/:roleId', role.deleteRoleInCamunda);

//----------CAMUNDA ROUTES-----------//
router.get('/camunda/:userId/roles/:roleId', camunda.getRequests);
router.post('/camunda', camunda.initiateRequest);
router.post('/camunda/:taskId/approve', camunda.approveRequest);
router.post('/camunda/:taskId/reject', camunda.rejectRequest);

//----------CAMUNDA USER ROUTES-----------//
router.get('/camunda/user', users.getUserListFromCamunda);
router.get('/users/camundaUserRole/:userId', users.camundaUserRoleList);
router.post('/users/createCamundaUser', users.createCamundaUser);
router.put('/users/camunda/updateCamundaUser', users.updateCamundaUser);
router.put('/users/camunda/camundaUserRoleAssignment', users.camundaUserRoleAssignment);
router.put('/users/camunda/camundaUserRoleRemoval', users.camundaUserRoleRemoval);
router.delete('/users/camunda/:userId', users.deleteCamundaUser);

// router.post('/camunda', camunda.initiateRequest);
// router.post('/camunda/:taskId/approve', camunda.approveRequest);
// router.post('/camunda/:taskId/reject', camunda.rejectRequest);

//test alive
router.get('/ping', (req, res)=>{
    res.json("pong");
    return;
});

export { router };