import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as apn from 'apn';

const configureApn = (config: {[key: string]: {[key1: string]: string}}) : apn.Provider => new apn.Provider({
  token: {
    key: Buffer.from(config.credentials.key),
    keyId: config.credentials.keyid,
    teamId: config.credentials.teamid,
  },
  production: false
});

const configureFcm = (config: {[key: string]: {[key1: string]: string}}) : admin.messaging.Messaging => {
   const pushingApp = admin.initializeApp({
    credential: config.credentials ? admin.credential.cert(config.credentials) : admin.credential.applicationDefault()
  }, 'pushingApp');
  return admin.messaging(pushingApp);
};

export default (config : functions.config.Config) => {
  const apnProvider = configureApn(config.pusher.apn);
  const fcmProvider = configureFcm(config.pusher.fcm);

  const handleError = (response : express.Response) => (err : Error) => {
    console.log(err, err.stack);
    response.status(500).send(err);
  };

  const pushers : {[key: string]: (token: string, body: any) => Promise<any>}
    = {
      "FCM": (token, body) => {
        return fcmProvider.sendToDevice([token], { data: body })
      },
      "APNS": (token, payload) => {
        const bundleId = config.pusher.apn.bundle_id;
        return apnProvider.send(new apn.Notification({
          topic: bundleId,
          payload,
          alert: 'Example push sent from pushek',
        }), token)
          .then(res => {
            if (res.failed.length > 0)
              return Promise.reject(res);
            return Promise.resolve(res);
          });
      }
    }

  const app = express();
  app.post('/', (request, response) => {
    const { deviceToken, body, pusherType } = request.body;
    if (!deviceToken) {
      handleError(response)(new Error("No device token provided"));
      return;
    }
    if (!pusherType) {
      handleError(response)(new Error("No pusher type provided"));
      return;
    }
    console.log(`Sending push "${JSON.stringify(body)}" to token: ${deviceToken}`);
    return pushers[pusherType](deviceToken, body)
      .then(() => {
        response.status(200).send("ok");
      })
      .catch(handleError(response));
  });
  return app;
};
