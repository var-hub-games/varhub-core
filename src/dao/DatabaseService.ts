
import Datastore from 'nedb';


const db = new Datastore({ filename: 'database.db' });
db.loadDatabase(function (err) {    // Callback is optional
    // Now commands will be executed
});
