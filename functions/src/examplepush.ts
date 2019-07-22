import * as express from 'express';
import * as admin from 'firebase-admin';

export default (messaging : admin.messaging.Messaging) => {

  const handleError = (response : express.Response) => (err : Error) => {
    console.log(err, err.stack);
    response.status(500).send(err);
  };

  const pushers : {[key: string]: (token: string, body: any) => Promise<any>}
    = {
      "FCM": (token, body) => {
        return messaging.sendToDevice([token], { data: body })
      },
      "APNS": () => {
        return Promise.reject("APNS not implemented yet");
      }
    }

  const app = express();
  app.post('/', (request, response) => {
    const { token, body, pusherType } = request.body;
    if (!token) {
      handleError(response)(new Error("No device token provided"));
      return;
    }
    if (!pusherType) {
      handleError(response)(new Error("No pusher type provided"));
      return;
    }
    console.log(`Sending push "${JSON.stringify(body)}" to token: ${token}`);
    return pushers[pusherType](token, body)
      .then(() => {
        response.status(200).send("ok");
      })
      .catch(handleError(response));
  });
  return app;
};
