## Intro

This is a sample Android that registers itself to Pushek web app and
receives messages. The purpose of this sample is to showcase the entire
flow of this tool. It's NOT meant for demonstrating good practices in
modern Android apps. Code is simplified to the minimum.

To make it work you need to have your Firebase project created. If you
want to just play with this tool you can set up your Android app in
Firebase where you deploy Pushek web app. If you plan to set it up for
your production, use your production Firebase.

Note that setting up for production will require authorizing Pushek's
sample pusher with your production credentials or prepare your own
backend to handle Pushek requests.

## Setup

1. You sample app to be configured with Firebase. It requires adding
   sample to the project. Firebase wizard will ask you to do several
   things described
   [here](https://firebase.google.com/docs/android/setup?authuser=0#console)
   but there is only one that you actually need to do.
   
   **Copy google-services.json file to your project's app module.**
   
2. Inside *MainActivity* class, there is a property called
   *FIREBASE_URL* that you need to specify. You can find it in your
   Firebase project where Pushek registration cloud function is
   deployed.
   


