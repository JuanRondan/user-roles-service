import * as request from 'request';

const camundaIp: string = "http://40.121.159.38:8080/engine-rest";
const camunda = {

    getRequests: (req, res) => {
        let userId = req.params.userId;
        let appendParams = '';
        let role = req.params.roleId.toLowerCase();

        const DEPLOYMENT_ID = 'RequestApproval:1:5f955e8c-1a93-11e9-b1de-000d3a1bf7dd';
        const STAGE_FIRST_APPROVAL = 'Pending First Approval';
        const STAGE_SECOND_APPROVAL = 'Pending Second Approval';
        const STAGES_PRIORITY = [
            STAGE_SECOND_APPROVAL,
            STAGE_FIRST_APPROVAL,
        ];

        if (role.indexOf("first") !== -1 || role.indexOf("1") !== -1) {
            appendParams = '&name=' + STAGE_FIRST_APPROVAL;
        } else if (role.indexOf("second") !== -1 || role.indexOf("2") !== -1) {
            appendParams = '&name=' + STAGE_SECOND_APPROVAL;
        }

        let url = `${camundaIp}/history/task?processDefinitionId=${DEPLOYMENT_ID}${appendParams}`;

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
                            let ret = body.filter(v=>{
                                return (/*appendParams.length === 0 && */v.processInstance.owner.value === userId) || 
                                role.indexOf("admin") !== -1 || 
                                (appendParams.indexOf(v.name) !== -1/* && v.processInstance.owner.value !== userId*/);
                            });
                            let finalResult = [];
                            let covered = {};
                            ret.forEach((currentTask, indexSelectedTask) => {
                                if (!covered[indexSelectedTask]) {
                                    let filteredTasks = ret.filter(r => r.processInstanceId === currentTask.processInstanceId);
                                    let selected = null;
                                    filteredTasks.forEach(filteredSelectedTask => {
                                        if (selected) {
                                            let idx = STAGES_PRIORITY.indexOf(filteredSelectedTask.name);
                                            let j = -1;
                                            while (ret[++j].id !== filteredSelectedTask.id);
                                            covered[j] = true;
                                            if (STAGES_PRIORITY.indexOf(selected.name) > idx) {
                                                selected = filteredSelectedTask;
                                            }
                                        } else {
                                            selected = filteredSelectedTask;
                                        }
                                    });
                                    if (selected.deleteReason === 'completed') {
                                        if (selected.processInstance.option.value === 'yes') {
                                            selected.name += ' (ACCEPTED)';
                                        } else {
                                            selected.name += ' (REJECTED)';
                                        }
                                    }
                                    finalResult.push(selected);
                                }
                            });
                            res.json(finalResult);
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
                /* "name": {
                    "value": req.body.name,
                    "type": "String"
                }, */
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
            url: `${camundaIp}/process-definition/key/RequestApproval/submit-form`,
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