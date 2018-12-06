import { app } from '../src/app';
import { agent, SuperTest, Test, CallbackHandler, Response } from 'supertest';
import { should, expect, assert} from 'chai';
import { describe, it, Suite, before, Func, AsyncFunc, Context, Done } from 'mocha';

const supertest = agent(app);

describe( "Unit Testing", function unitTesting (this: Suite) {

    it( "ping", (done: Done) => {
        supertest.get('/api/ping')
        .expect(200)
        .end( (err: any, res: Response) => {
            expect(res.body).to.equal("pong");
            done();
        });
    });

})