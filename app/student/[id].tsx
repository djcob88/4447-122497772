import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { Student, StudentContext } from '../_layout';

export default function StudentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(StudentContext);

  if (!context) return null;

  const { students, setStudents } = context;

  const student = students.find(
    (s: Student) => s.id === Number(id)
  );

  if (!student) return null;

  const deleteStudent = () => {
    setStudents(students.filter(s => s.id !== Number(id)));
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>{student.name}</Text>
      <Text>{student.major}</Text>
      <Text>{student.year}</Text>

      <Button
        title="Edit"
        onPress={() =>
          router.push({
            pathname: '../student/[id]/edit',
            params: { id }
          })
        }
      />

      <Button title="Delete" onPress={deleteStudent} />

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}