const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

class Firebase {

    // app: firebase.app.App;
    // db: firebase.database.Database;

    constructor() {
         firebase.initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
        });
    }


    getDevices() {




        firebase.firestore().collection("pins").doc('1234').get().then((doc: any) => {

            console.log('here')
            console.log(doc.id);
// doc.collection('devices').get().then((docs: any) => {
//     console.log(docs);
// });

            // console.log(querySnapshot.docs);
            //
            // querySnapshot.forEach((doc: any) => {
            //
            //     console.log(doc);
            //
            //     console.log(`${doc.id} => ${doc.data().name}`);
            //
            //     // this.setState({devices: })
            // });
        });
    }
}

export default Firebase;
