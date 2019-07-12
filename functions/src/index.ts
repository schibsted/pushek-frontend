import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import expiration from './expiration'
import generate from './generate';
import register from'./register';
import pushApp from './examplepush';

const app = express();
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

const generateNonExistingPin = generate(db);
app.post('/', (request, response) => {
  generateNonExistingPin()
    .then(p => response.send(p))
    .catch(err => {
      console.log(err, err.stack);
      return response.status(500).send({ error: err }) 
    });
});

const registerDevice = register(db);
app.post('/:pin', (request, response) => {
  registerDevice(request.params.pin, request.body)
    .then(p => response.send("ok"))
    .catch(err => {
      console.log(err, err.stack);
      return response.status(500).send({ error: err }) 
    });
});

export const pins = functions.https.onRequest(app);
export const expireOldPins = functions.pubsub.schedule('every 1 hours').onRun(expiration(db));
export const examplePush = functions.https.onRequest(pushApp(admin.messaging()));
