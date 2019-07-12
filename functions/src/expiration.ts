import * as consts from './consts';

export default (db : FirebaseFirestore.Firestore) => {

  const findExpired = (now : number) : Promise<FirebaseFirestore.QuerySnapshot> => {
    return db.collection('pins')
      .where(consts.EXPIRATION_TIMESTAMP_KEY, '>', now)
      .get();
  };

  const deleteDocs = async (docs : FirebaseFirestore.QuerySnapshot) : Promise<number> => {
    if (docs.size > 0) {
      const batch = db.batch();
      docs.forEach((doc) => { 
        console.log(`Expiring pin ${doc.ref}`);
        return batch.delete(doc.ref);
      });
      await batch.commit()
    }
    return docs.size; 
  };

  return async () => {
    const expired = await findExpired(new Date().getTime());
    await deleteDocs(expired); 
  }
};
