import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../context/AuthContext';

export function useFollow() {
  const { user } = useAuth();
  const [followedTemples, setFollowedTemples] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFollowedTemples([]);
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setFollowedTemples(snapshot.data().followedTemples ?? []);
      } else {
        setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          followedTemples: [],
          createdAt: new Date().toISOString(),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  async function follow(templeId: string) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      followedTemples: arrayUnion(templeId)
    });
  }

  async function unfollow(templeId: string) {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      followedTemples: arrayRemove(templeId)
    });
  }

  function isFollowing(templeId: string) {
    return followedTemples.includes(templeId);
  }

  return { followedTemples, loading, follow, unfollow, isFollowing };
}