import { onAuthStateChanged, User as AuthUser } from 'firebase/auth';
import { useAtom } from 'jotai';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { userAtom } from '@/globalState/user';
import { auth, firestore } from '@/firebase/client';
import { User } from '@/types/user';
import { UserConverter } from '@/converter/user';

interface Props {
  children: ReactNode;
}

const AuthProvider = (props: Props) => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useAtom(userAtom);

  const setCurrentUserFunc = async (authUser: AuthUser | null) => {
    if (authUser) {
      // userがfirestoreのusersコレクションに存在するか確認し,存在しなければ作成する
      const userRef = doc(firestore, 'users', authUser.uid).withConverter(UserConverter);
      const userSnapShot = await getDoc(userRef);
      console.log(userSnapShot.data());
      if (!userSnapShot.exists()) {
        const _newUser = {
          id: authUser.uid,
          name: authUser.displayName ?? '',
          email: authUser.email ?? '',
          createdAt: Date.now(),
        };
        console.log(_newUser);
        await setDoc(userRef, _newUser);
        const userSnapShot = await getDoc(userRef);
        if (!userSnapShot.exists()) {
          throw new Error('user not found');
        }
        const _user: User = userSnapShot.data();
        setCurrentUser(_user);
      } else {
        setCurrentUser(userSnapShot.data());
      }
      void router.push(`/dashboard`);
    } else {
      setCurrentUser(null);
      void router.push(`/signin`);
    }
  };

  useEffect(() => {
    // authの情報が変更されたらsetCurrentUserFuncを実行する
    onAuthStateChanged(auth, (authUser) => void setCurrentUserFunc(authUser));
  }, [router]);

  return <>{props.children}</>;
};

export default AuthProvider;
