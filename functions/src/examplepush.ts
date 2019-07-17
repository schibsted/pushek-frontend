import * as express from 'express';
import * as admin from 'firebase-admin';

export default (messaging : admin.messaging.Messaging) => {

  const handleError = (response : express.Response) => (err : Error) => {
    console.log(err, err.stack);
    response.status(500).send(err);
  };

  const app = express();
  app.post('/', (request, response) => {
    const { deviceToken, body } = request.body;
    if (!deviceToken) {
      handleError(response)(new Error("No device token provided"));
      return;
    }
    console.log(`Sending push "${JSON.stringify(body)}" to token: ${deviceToken}`);
    return messaging.sendToDevice([deviceToken], { data: body })
      .then(() => {
        response.status(200).send("ok");
      })
      .catch(handleError(response));
  });
  return app;
};
