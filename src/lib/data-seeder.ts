
'use client';
import { useEffect } from 'react';
import { useDatabase } from '@/firebase';
import { ref, set, get } from 'firebase/database';
import { authors, books, users, borrowedRecords } from '@/lib/data';

export function useDataSeeder() {
  const db = useDatabase();

  useEffect(() => {
    const seedData = async () => {
      try {
        const dataExistsRef = ref(db, 'dataExists');
        const snapshot = await get(dataExistsRef);
        if (snapshot.exists()) {
          console.log('Data already seeded.');
          return;
        }
        
        console.log('Seeding data...');

        await set(ref(db, 'authors'), authors.reduce((acc, author) => ({...acc, [author.id]: author}), {}));
        await set(ref(db, 'books'), books.reduce((acc, book) => ({...acc, [book.id]: book}), {}));
        await set(ref(db, 'users'), users.reduce((acc, user) => ({...acc, [user.id]: user}), {}));
        await set(ref(db, 'borrowedRecords'), borrowedRecords.reduce((acc, record) => ({...acc, [record.id]: record}), {}));

        await set(dataExistsRef, true);

        console.log('Data seeding complete.');
      } catch (error) {
        console.error('Error seeding data:', error);
      }
    };

    seedData();
  }, [db]);
}
