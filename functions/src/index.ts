import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import expiration from './expiration'
import generate from './generate';

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
      return response.status(500).send({ error: err }) });
});

export const generatePin = functions.https.onRequest(app);
export const expireOldPins = functions.pubsub.schedule('every 1 hour').onRun(expiration(db));
