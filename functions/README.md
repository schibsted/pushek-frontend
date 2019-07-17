# Google functions for push testing

These are the functions supporting push testing tool

## Configuration

The functions will use your default `admin()` [privileges](https://firebase.google.com/docs/functions/local-emulator#set_up_admin_credentials_optional). 

### Example push

If you want to use `/examplePush` endpoint with credentials from some other project/account, just set the retrieved json under appropriate configuration key:

```
firebase functions:config:set "$(cat credentials-file.json)"
```

## API

* `POST /pins` - creates a pin number under which devices can register
* `POST /pins/<pin_number>` - registers device under given pin number. Body format:
```
{
  "token":...
  "systemName":...
  "systemVersion":...
  "pusherType": "FCM" | "APNS"
}
```
* `POST /examplePush` - the endpoint realizing assumed push endpoint

## Assumed push endpoint

To be used with this project the tested push solution should expose following endpoint:
`POST /<somePath>`
that accepts following input format:
```
{
  "deviceToken":...,
  "body":...,
  "pusherType":....
}
```

## Internals 

The project consists of following

## Development

The project is easiest to use with [nix](https://nixos.org/nix/)

 * Install nix
 * Invoke `nix-shell` in root project directory

This gives you all the software you need to develop the functions, plus some handy aliases
 * `bf` - build functions - invokes full functions build
 * `kbf` - keep building functions - invokes `bf` everytime source file changes
 * `d` - deploy the project to firebase
 * `s` - create a shell with all functions available


