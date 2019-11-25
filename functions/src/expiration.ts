import * as consts from './consts';

export default (db : FirebaseFirestore.Firestore) => {

  const findExpiredPins = (now : number) : Promise<FirebaseFirestore.QuerySnapshot> => {
    return db.collection('pins')
      .where(consts.EXPIRATION_TIMESTAMP_KEY, '<', now)
      .get();
  };

  const expirePin = async (batch : FirebaseFirestore.WriteBatch, pin : FirebaseFirestore.QueryDocumentSnapshot) : Promise<void> => {
    console.log(`Expiring pin ${pin.id}`);
    const devices = await db.collection('pins')
      .doc(pin.id)
      .collection('devices')
      .get();
    await Promise.all(devices.docs.map(async device => await batch.delete(device.ref)));
    await batch.delete(pin.ref);
  };

  const expirePins = async (pins : FirebaseFirestore.QuerySnapshot) : Promise<void> => {
    if (pins.size > 0) {
      const batch = db.batch();
      await Promise.all(pins.docs.map(async (pin) => await expirePin(batch, pin)));
      await batch.commit()
    }
  };

  return async () => {
    console.log("Expiration started.");
    const expired = await findExpiredPins(new Date().getTime());
    await expirePins(expired); 
    console.log("Expiration done");
  }
};
