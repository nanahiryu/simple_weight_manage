import { DocumentData, FirestoreDataConverter } from 'firebase/firestore';

import { User } from '@/types/user';
import { Target } from '@/types/target';

export const UserConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      targetList: user.targetList,
    };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: data.id as string,
      name: data.name as string,
      email: data.email as string,
      createdAt: data.createdAt as number,
      targetList: data.targetList as Target[],
    };
  },
};
