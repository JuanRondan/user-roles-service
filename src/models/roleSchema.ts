import { Schema, model } from 'mongoose';

const roleTemplate = new Schema({
    name: { type: String, required: true, index: { unique: true } },
    description: { type: String, required: false }
    }   
);

const roleModel = model('role', roleTemplate); 

export { roleModel }