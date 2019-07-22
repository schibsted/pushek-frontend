# Pushek

This is a push testing tool reducing the burden of understanding the technical side of push messaging. It is targeted for non-technical people. However, requires technical people to set it up.

## What problem are we trying to solve?

## Component design
Below drawings show relevant components in both scenarions. First one is an example that require minimum work:
- Create new Firebase project
- Setup authorisation in pusher and mobile apps
- Deploy on Firebase

It's a good start to play with the tool and test capabilities :nerd_face:

If you want to integrate this tool with your own backend and mobile apps, look at Production drawing.
It requires extra stesp:
- In your backend system, provide two service. One for getting push config. Second for sending pushes. Go to [Setup](#backend)

### Pushek Web
This is a web app that testers will interact with most of the time. It creates PINs that enable pairing with mobile devices. Next, lists all devices paired with previously generated PIN. Lastly, call associated pusher to send push messages.

### Pushek Store
This is a Firestore database where we store generated PINs and associated devices. The most relevant information of each device is token. Token identify device and app where pusher send messages.

### Pushek Registry
This is a cloud function responsible for registering mobile devices. It requires a PIN, token, system info and push type. In case iOS devices we support both APNS and FCM integrations.

PIN is manually entered by tester on mobile device. Our sample app shows a simple field to take the PIN but it's totally up to you how your app will take it e.g. could be a dialog shown on long press in the setting menu.

### Pushek PIN generator
This is cloud function generating PIN numbers used to pair with mobile devices. New PIN is generate for every web app session. It has expiration time set. See [functions](functions) for more details.

### Pushek Pusher
This is cloud function that talks to FCM and APN sending push messages. In production setup it can be replaced with 3rd party service.

### Pushek Mobile
This is a sample app representing both Android and iOS.

![Componenets](docs/components.jpg)

## Flow design
![Flow](docs/flow.jpg)

## Project structure

Root of this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 

### Cloud functions
Backend for this tool is written in `/functions` as Cloud Functions and deployed on Firebase.

### Mobile
Sample mobile apps for Android and iOS(TBD) are located in `/examples` folder.
For more details about Android sample go to [Android sample doc](examples/android/README.md)

## Setup

### Web app

### Backend

### Mobile

Go to [Android sample doc](examples/android/README.md)
