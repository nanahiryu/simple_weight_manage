'use client';

import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { userAtom } from '@/globalState/user';

export default function Home() {
  const router = useRouter();
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  }, []);
}
