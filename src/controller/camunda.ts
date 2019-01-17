import * as request from 'request';

const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
const camunda = {

    getRequests: (req, res) => {
        request.get(`${camundaIp}/task?processDefinitionId=RequestApproval:1:97c9f097-199b-11e9-9519-000d3a1bf7dd`, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            res.status(200);
            body = JSON.parse(body);
            var n = body.length;
            if (n) {
                body.forEach((task, index) => {
                    request.get(`${camundaIp}/process-instance/${task.processInstanceId}/variables`, (e, response, processInstanceData) => {
                        body[index].processInstance = JSON.parse(processInstanceData);
                        n--;
                        if (n <= 0) {
                            res.json(body);
                        }
                    });
                });
            } else {
                res.json(body);
            }
        });
    },

    initiateRequest: (req, res) => {
        if (req.params && req.params.userId) {

            const payload = {
                "variables": {
                    "owner": {
                        "value": req.params.userId,
                        "type": "String"
                    },
                    "creationDate": {
                        "value": req.body.creationDate,
                        "type": "String"
                    },
                    "description": {
                        "value": req.body.description,
                        "type": "String"
                    }
                }
            }
            request.post(`${camundaIp}/process-definition/key/RequestApproval/start`, payload, (error, response, body) => {
                if (error) {
                    console.dir(error);
                    res.status(500);
                    res.json({ 'message': 'camunda server error' });
                    return;
                }
                res.status(201);
                res.json(JSON.parse(body));
            });
        } else {
            res.status(400);
            res.json({ 'message': 'bad request - missing paramter userId' });
        }
    },

    approveRequest: (req, res) => {
        if (req.params && req.params.taskId) {
            const payload = {
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
            const payload = {
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