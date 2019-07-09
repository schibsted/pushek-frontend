import * as functions from 'firebase-functions';
import * as express from 'express';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
const app = express();
app.post('/', (request, response) => {
  const original = request.query.text;
  response.send("Hello from Firebase! You've sent me: " + original);
})
export const helloWorld = functions.https.onRequest(app);
