import StudentCard from '@/components/StudentCard';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Student = {
  id: number;
  name: string;
  major: string;
  year: string;
  count: number;
};

export default function IndexScreen() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Emilia', major: 'Computer Science', year: '3', count: 0 },
    { id: 2, name: 'Jackie', major: 'Business', year: '2', count: 0 },
    { id: 3, name: 'Sammy', major: 'Engineering', year: '4', count: 0 },
  ]);

  const updateCount = (id: number, delta: number) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id
          ? { ...student, count: student.count + delta }
          : student
      )
    );
  };

  const removeStudent = (id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const resetAll = () => {
    setStudents(prev =>
      prev.map(student => ({ ...student, count: 0 }))
    );
  };

  const total = students.reduce((sum, s) => sum + s.count, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>

        <Text style={styles.total}>Total Score: {total}</Text>

        {total > 5 && <Text style={{ color: 'green' }}>Class doing great</Text>}
        {total < 0 && <Text style={{ color: 'red' }}>Class struggling</Text>}

        <Button title="Reset All" onPress={resetAll} />

        {students.length === 0 ? (
          <Text style={{ marginTop: 20 }}>No students added yet.</Text>
        ) : (
          students.map(student => (
            <StudentCard
              key={student.id}
              {...student}
              onUpdate={updateCount}
              onRemove={removeStudent}
            />
          ))
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  total: {
    fontSize: 22,
    marginBottom: 10,
  },
});
