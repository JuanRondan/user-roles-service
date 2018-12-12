import { app } from './app';
import './models/dbconnection';

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl-C to quit.');
});