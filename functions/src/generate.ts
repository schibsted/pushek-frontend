import * as consts from './consts';

export default (db : FirebaseFirestore.Firestore) => {
  const EXPIRATION_OFFSET = 1000*60*60;
  const getRndInteger = (min : number, max : number) : number => {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  const expirationTimestamp = () : number => new Date().getTime() + EXPIRATION_OFFSET;
  const createIfDoesntExist = async (pin : string) : Promise<boolean> => {
    const pinRef = db.collection('pins').doc(pin);
    return db.runTransaction(async (tx) => {
      const pinDoc = await tx.get(pinRef);
      if (!pinDoc.exists) {
        await tx.create(pinRef, {
          [consts.EXPIRATION_TIMESTAMP_KEY]: expirationTimestamp()
        });
        return true;
      }
      return false;
    });
  };

  const generateNonExistingPin = async () : Promise<string> => {
    const pin = getRndInteger(0, 9999).toString().padStart(4, '0');
    const created = await createIfDoesntExist(pin);
    return created ? pin : generateNonExistingPin();
  };

  return generateNonExistingPin;
}
