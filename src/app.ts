import { router } from './routes/routes';
import * as express from 'express';
import * as cors from 'cors';
import * as idamOpenIdAuth from '@pa-util/idam-openidauth';

const idam = idamOpenIdAuth.Idam;
const app = express();

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

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors());

app.use(
    '/api', router
);

export { app };