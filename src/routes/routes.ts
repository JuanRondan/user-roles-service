import { users } from '../controller/users'
import { role } from '../controller/roles'
import * as express from 'express';
import * as cors from 'cors';
import * as idamOpenIdAuth from '@pa-util/idam-openidauth';

const router = express.Router();
const app: express.Express = express();
const idam = idamOpenIdAuth.Idam;

idam.Configure({
    discoveryUrl: 'https://fedsvc-stage.pwc.com/ofisids/api/discovery',
    cacheRetriever: (async (key) => {
        console.log("Retriever: ", key);
        return null;
    }),
    cacheCallback: (key, data) => {
        console.log("Callback: ", key, data);
        return;
    }
});

app.use(cors());

app.use( idam.OpenIdMiddleware() , (req, res, next) => {
    next();
});

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