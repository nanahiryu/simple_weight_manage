import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { User } from '@/types/user';

export const UserConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: data.id as string,
      name: data.name as string,
      email: data.email as string,
      createdAt: data.createdAt as number,
    };
  },
};
