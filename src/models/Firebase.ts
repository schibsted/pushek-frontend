import {Device} from "../types/Device";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class Firebase {

    constructor() {
        firebase.initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
        });
    }

    getDevices(pin: string, callback: Function) {

        firebase.firestore()
            .collection("pins").doc(pin)
            .collection('devices').onSnapshot((querySnapshot: any) => {

            let result: Array<Device> = [];
            querySnapshot.forEach((doc: any) => {
                result.push(doc.data());
            });

            callback(result);
        });

    }
}

export default Firebase;
