interface Device {
  token: string;
  systemVersion: string;
  systemName: string;
}

export class PinDoesntExistError extends Error {
  constructor(m: string) {
    super(m);

    Object.setPrototypeOf(this, PinDoesntExistError.prototype);
  }
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

export const register = (db : FirebaseFirestore.Firestore) => {
  const pinExists = (pin : string) : Promise<boolean> => db.collection('pins')
    .doc(pin)
    .get()
    .then(doc => { 
      return doc.exists;
    });

  return async (pin: string, device : Device) : Promise<boolean> => {
    validateDevice(device);
    const exists = await pinExists(pin);
    if (!exists) {
      throw new PinDoesntExistError(`Pin ${pin} doesn't exist`);
    }
    await db.collection('pins')
        .doc(pin)
        .collection('devices')
        .add(device);
    return true;
  }
}
