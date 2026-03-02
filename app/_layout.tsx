import { Stack } from 'expo-router';
import { createContext, useState } from 'react';

export type Student = {
  id: number;
  name: string;
  major: string;
  year: string;
  count: number;
};

type StudentContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
};

export const StudentContext =
  createContext<StudentContextType | null>(null);

export default function RootLayout() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Emilia', major: 'Computer Science', year: '3', count: 0 },
    { id: 2, name: 'Jackie', major: 'Business', year: '2', count: 0 },
    { id: 3, name: 'Sammy', major: 'Engineering', year: '4', count: 0 },
  ]);

  return (
    <StudentContext.Provider value={{ students, setStudents }}>
      <Stack />
    </StudentContext.Provider>
  );
}