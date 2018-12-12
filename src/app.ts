import { router } from './routes/routes';
import * as cors from 'cors';
import * as express from 'express';

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors());

app.use(
    '/api', router
);

export { app };