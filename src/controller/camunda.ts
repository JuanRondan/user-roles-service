import * as request from 'request';

const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
const camunda = {

    getRequests: (req, res) => {
        request.get(`${camundaIp}/task`, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            res.status(200);
            res.json(body);
        });
    },

    initiateRequest: (req, res) => {
        request.post(`${camundaIp}/process-definition/key/RequestApproval/start`, {}, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            res.status(201);
            res.json(body);
        });
    },

    approveRequest: (req, res) => {
        if (req.params && req.params.taskId) {

            let payload = {
                "variables": {
                    "option": {
                        "value": "yes"
                    }
                }
            }

            request.put(`${camundaIp}/task/${req.params.taskId}/complete`, payload, (error, response, body) => {
                if (error) {
                    console.dir(error);
                    res.status(500);
                    res.json({ 'message': 'camunda server error' });
                    return;
                }
                res.status(200);
                res.json(body);
            });
        } else {
            res.status(400);
            res.json({ 'message': 'bad request - missing paramter taskId' });
        }
    },

    rejectRequest: (req, res) => {
        if (req.params && req.params.taskId) {

            let payload = {
                "variables": {
                    "option": {
                        "value": "no"
                    }
                }
            }

            request.put(`${camundaIp}/task/${req.params.taskId}/complete`, payload, (error, response, body) => {
                if (error) {
                    console.dir(error);
                    res.status(500);
                    res.json({ 'message': 'camunda server error' });
                    return;
                }
                res.status(200);
                res.json(body);
            });
        } else {
            res.status(400);
            res.json({ 'message': 'bad request - missing paramter taskId' });
        }
    }
}

export { camunda };