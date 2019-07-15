import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import expiration from './expiration'
import generate from './generate';
import * as register from'./register';

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

const registerDevice = register.register(db);
app.post('/:pin', async (request, response) => {
  try { 
    await registerDevice(request.params.pin, request.body)
    return response.send("ok");
  } catch (err) {
    if (err instanceof register.PinDoesntExistError) {
      return response.status(404).send(err.message);
    }
    console.log(err, err.stack);
    return response.status(500).send({ error: err });
  }
});

export const pins = functions.https.onRequest(app);
export const expireOldPins = functions.pubsub.schedule('every 1 hours').onRun(expiration(db));
