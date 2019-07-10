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

const createIfDoesntExist = async (pin : string) : Promise<boolean> => {
  const pinRef = db.collection('pins').doc(pin);
  return db.runTransaction(async (tx) => {
    const pinDoc = await tx.get(pinRef);
    if (!pinDoc.exists) {
      await tx.create(pinRef, {});
      return true;
    }
    return false;
  });
};

const generateNonExistingPin = async () : Promise<string> => {
  const pin = getRndInteger(0, 9999).toString().padStart(4, '0');
  const created = await createIfDoesntExist(pin);
  return created ? pin : generateNonExistingPin();
};

app.post('/', (request, response) => {
  generateNonExistingPin()
    .then(p => response.send(p))
    .catch(err => {
      console.log(err, err.stack);
      return response.status(500).send({ error: err }) });
});

export const generatePin = functions.https.onRequest(app);
