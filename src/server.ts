import { app } from './app';
import './models/dbconnection';

const PORT = process.env.PORT || 8080;
app.listen(3000, function () {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl-C to quit.');
});
