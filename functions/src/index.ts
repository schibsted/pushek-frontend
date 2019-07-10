import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

const getRndInteger = (min : number, max : number) : number => {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
const app = express();
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();

const createIfDoesntExist = (pin : string) : Promise<boolean> => {
  const pinRef = db.collection('pins').doc(pin);
  return db.runTransaction((tx) =>
    tx.get(pinRef)
      .then(pinDoc => {
        if (pinDoc.exists) {
          return false;
        }
        tx.create(pinRef, {});
        return true;
      }));
};

const generateNonExistingPin = () : Promise<string> => {
  const pin = getRndInteger(0, 9999).toString().padStart(4, '0');
  return createIfDoesntExist(pin)
    .then(created => {
      if (created) {
        return pin;
      }
      return generateNonExistingPin();
    });
};

app.post('/', (request, response) => {
  generateNonExistingPin()
    .then(p => response.send(p))
    .catch(err => {
      console.log(err, err.stack);
      return response.status(500).send({ error: err }) });
});

export const generatePin = functions.https.onRequest(app);
