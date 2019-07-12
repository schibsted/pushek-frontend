interface Device {
  token: string;
  systemVersion: string;
  systemName: string;
}

export default (db : FirebaseFirestore.Firestore) => {
  return (pin: string, device : Device) : Promise<boolean> => {
    return db.collection('pins')
      .doc(pin)
      .collection('devices')
      .add(device)
      .then(() => true);
  }
}
