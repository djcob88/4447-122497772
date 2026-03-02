import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { StudentContext } from './_layout';

export default function AddStudent() {
  const router = useRouter();
  const context = useContext(StudentContext);

  if (!context) return null;
 
  const { students, setStudents } = context;

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');

  const saveStudent = () => {
    const newStudent = {
      id: Date.now(),
      name,
      major,
      year,
      count: 0,
    };

    setStudents([...students, newStudent]);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Major" value={major} onChangeText={setMajor} />
      <TextInput placeholder="Year" value={year} onChangeText={setYear} />

      <Button title="Save" onPress={saveStudent} />
    </View>
  );
}