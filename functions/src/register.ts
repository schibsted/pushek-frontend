interface Device {
  token: string;
  systemVersion: string;
  systemName: string;
}

const assertPresent = (fieldName : string, val : any) => {
  if (!val) {
    throw new Error(`Field ${fieldName} should be present on the device`);
  }
}

const validateDevice = (device : Device) => {
  assertPresent("token", device.token);
  assertPresent("systemVersion", device.systemVersion);
  assertPresent("systemName", device.systemName);
};

export default (db : FirebaseFirestore.Firestore) => {
  const pinExists = (pin : string) : Promise<boolean> => db.collection('pins')
    .doc(pin)
    .get()
    .then(doc => { 
      if (!doc.exists) {
        throw new Error(`Pin ${pin} doesn't exist`);
      }
      return true;
    });

  return async (pin: string, device : Device) : Promise<boolean> => {
    validateDevice(device);
    return pinExists(pin)
      .then(() => db.collection('pins')
        .doc(pin)
        .collection('devices')
        .add(device))
      .then(() => true);
  }
}
