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
const EXPIRATION_OFFSET = 1000*60*60;
const EXPIRATION_TIMESTAMP_KEY = "expirationTimestamp"

const expirationTimestamp = () : number => new Date().getTime() + EXPIRATION_OFFSET;

const findExpired = (now : number) : Promise<FirebaseFirestore.QuerySnapshot> => {
  return db.collection('pins')
    .where(EXPIRATION_TIMESTAMP_KEY, '>', now)
    .get();
};

const deleteDocs = async (docs : FirebaseFirestore.QuerySnapshot) : Promise<number> => {
  if (docs.size > 0) {
    const batch = db.batch();
    docs.forEach((doc) => { 
      console.log(`Expiring pin ${doc}`);
      return batch.delete(doc.ref);
    });
    await batch.commit()
  }
  return docs.size; 
};

const createIfDoesntExist = async (pin : string) : Promise<boolean> => {
  const pinRef = db.collection('pins').doc(pin);
  return db.runTransaction(async (tx) => {
    const pinDoc = await tx.get(pinRef);
    if (!pinDoc.exists) {
      await tx.create(pinRef, {
        [EXPIRATION_TIMESTAMP_KEY]: expirationTimestamp()
      });
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
export const expireOldPins = functions.pubsub.schedule('every 1 hour').onRun(async (ctx) => {
  const expired = await findExpired(new Date().getTime());
  await deleteDocs(expired); 
});
