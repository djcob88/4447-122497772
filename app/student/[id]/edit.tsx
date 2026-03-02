import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { Student, StudentContext } from '../../_layout';

export default function EditStudent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(StudentContext);

  if (!context) return null;

  const { students, setStudents } = context;

  const student = students.find(
    (s: Student) => s.id === Number(id)
  );

  if (!student) return null;

  const [name, setName] = useState(student.name);
  const [major, setMajor] = useState(student.major);
  const [year, setYear] = useState(student.year);

  const saveChanges = () => {
    setStudents(
      students.map(s =>
        s.id === Number(id)
          ? { ...s, name, major, year }
          : s
      )
    );

    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput value={name} onChangeText={setName} />
      <TextInput value={major} onChangeText={setMajor} />
      <TextInput value={year} onChangeText={setYear} />

      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  );
}