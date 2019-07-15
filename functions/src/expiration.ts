import * as consts from './consts';

export default (db : FirebaseFirestore.Firestore) => {

  const findExpiredPins = (now : number) : Promise<FirebaseFirestore.QuerySnapshot> => {
    return db.collection('pins')
      .where(consts.EXPIRATION_TIMESTAMP_KEY, '>', now)
      .get();
  };

  const expirePins = async (docs : FirebaseFirestore.QuerySnapshot) : Promise<void> => {
    if (docs.size > 0) {
      const batch = db.batch();
      docs.forEach((doc) => {
        console.log(`Expiring pin ${doc.ref}`);
        return db.collection('pins')
          .doc(doc.id)
          .collection('devices')
          .get()
          .then(devices => devices.forEach(device => batch.delete(device.ref)));
      });
      await batch.commit()
    }
  };

  return async () => {
    const expired = await findExpiredPins(new Date().getTime());
    await expirePins(expired); 
  }
};
