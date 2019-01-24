import * as request from 'request';

const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
const camunda = {

    getRequests: (req, res) => {
        const DEFINITION_KEY = 'RequestApproval';
        let userId = req.params.userId;
        let role = req.params.roleId.toLowerCase();
        let url = `${camundaIp}/task?processDefinitionKey=${DEFINITION_KEY}`;

        if (role === "user") {
            url += `&owner=${userId}`;
        } else {
            url += `&assigneeLike=%${role}%`;
        }

        request.get(url, (error, response, body) => {
            if (error) {
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }

            res.status(200);
            body = JSON.parse(body);
            var n = body.length;

            if (n) {
                body.forEach((task, index) => {
                    request.get(`${camundaIp}/history/variable-instance?processInstanceId=${task.processInstanceId}`, (e, response, processInstanceData) => {
                        processInstanceData = JSON.parse(processInstanceData);
                        body[index].processInstance = {};
                        processInstanceData.forEach(variable => {
                            body[index].processInstance[variable.name] = {
                                value : variable.value,
                                type : variable.type,
                            };
                        });
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
        const payload = {
            "variables": {
                "owner": {
                    "value": req.body.owner,
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
        
        request({
            url: `${camundaIp}/process-definition/key/RequestApproval/start`,
            method: "POST",
            json: payload
        }, (error, response, body) => {
            if (error) {
                console.dir(error);
                res.status(500);
                res.json({ 'message': 'camunda server error' });
                return;
            }
            res.status(201);
            res.json(response);
        });
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
            request({
                url: `${camundaIp}/task/${req.params.taskId}/complete`,
                method: "POST",
                json: payload
            }, (error, response, body) => {
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
            request({
                url: `${camundaIp}/task/${req.params.taskId}/complete`,
                method: "POST",
                json: payload
            }, (error, response, body) => {
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