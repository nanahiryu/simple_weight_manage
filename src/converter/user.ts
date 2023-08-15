import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { User } from '@/types/user';

export const UserConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    const _newDoc: Partial<User> = { ...user };
    delete _newDoc.id;
    return _newDoc;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name as string,
      email: data.email as string,
      createdAt: data.createdAt as number,
    };
  },
};
