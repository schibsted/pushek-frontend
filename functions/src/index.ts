import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import expiration from './expiration'
import generate from './generate';
import * as register from'./register';
import pushApp from './examplepush';
import * as cors from 'cors';

const corsHandler = cors({origin: true});
const app = express();
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

const generateNonExistingPin = generate(db);
app.post('/', (request, response) => {
  corsHandler(request, response, () => {
    generateNonExistingPin()
        .then(p => response
            .set('Content-Type', 'text/plain')
            .send(p))
        .catch(err => {
          console.log(err, err.stack);
          return response.status(500).send({ error: err })
        });
  })
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

export const pins = functions.region('europe-west1').https.onRequest(app);
export const expireOldPins = functions.region('europe-west1').pubsub.schedule('every 1 hours').onRun(expiration(db));

const credentials = functions.config().pusher.credentials;
const pushingApp = admin.initializeApp({
  credential: credentials ? admin.credential.cert(credentials) : admin.credential.applicationDefault()
}, 'pushingApp');
export const examplePush = functions.region('europe-west1').https.onRequest(pushApp(admin.messaging(pushingApp)));
