import * as functions from 'firebase-functions';
import * as express from 'express';

const getRndInteger = (min : number, max : number) => {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
const app = express();
app.post('/', (request, response) => {
  const r = getRndInteger(0, 9999).toString();
  response.send(r.padStart(4, '0'));
})
export const generatePin = functions.https.onRequest(app);
