import { Schema, model} from 'mongoose';


const userTemplate = new Schema({
    //_id: { type: Schema.Types.ObjectId },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: true},
    roles: { type: [String] },
    birthDate: { type: Date, required: false},
});

const userModel = model('user', userTemplate); 

export { userModel }