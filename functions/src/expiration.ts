import * as consts from './consts';

export default (db : FirebaseFirestore.Firestore) => {

  const findExpired = (now : number) : Promise<FirebaseFirestore.QuerySnapshot> => {
    return db.collection('pins')
      .where(consts.EXPIRATION_TIMESTAMP_KEY, '>', now)
      .get();
  };

  const expirePin = (pinRef : FirebaseFirestore.DocumentReference, batch : FirebaseFirestore.WriteBatch) : Promise<void> => {
    console.log(`Expiring pin ${pinRef}`);
    return db.collection('pins')
      .doc(pinRef.id)
      .collection('devices')
      .get()
      .then(devices => devices.forEach(device => batch.delete(device.ref)));
  }

  const deleteDocs = async (docs : FirebaseFirestore.QuerySnapshot) : Promise<void> => {
    if (docs.size > 0) {
      const batch = db.batch();
      docs.forEach((doc) => expirePin(doc.ref, batch));
      await batch.commit()
    }
  };

  return async () => {
    const expired = await findExpired(new Date().getTime());
    await deleteDocs(expired); 
  }
};
