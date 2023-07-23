import { User } from "@/types/user";
import { DocumentData, FirestoreDataConverter } from "firebase/firestore";

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
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.createdAt,
    };
  },
};
