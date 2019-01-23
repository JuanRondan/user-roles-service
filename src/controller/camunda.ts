import * as request from 'request';

const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
const camunda = {

    getRequests: (req, res) => {
        const DEPLOYMENT_ID = 'RequestApproval:1:2abfbc25-1f3f-11e9-99f5-000d3a1bf7dd';
        const FIRST_STAGE_FILTER_ID = '2d83b061-1e51-11e9-a6c4-000d3a1bf7dd';
        const SECOND_STAGE_FILTER_ID = '68409d82-1e51-11e9-a6c4-000d3a1bf7dd';
        let url = `${camundaIp}/task?processDefinitionId=${DEPLOYMENT_ID}`;
        let userId = req.params.userId;
        let role = req.params.roleId.toLowerCase();

        if (role === "approver1") {
            url = `${camundaIp}/filter/${FIRST_STAGE_FILTER_ID}/list`;
        } else if (role === "approver2") {
            url = `${camundaIp}/filter/${SECOND_STAGE_FILTER_ID}/list`;
        } if (role === "user") {
            url += `&taskOwner=${userId}`;
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