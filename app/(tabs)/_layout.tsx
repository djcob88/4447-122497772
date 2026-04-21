import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{headerShown: false, sceneStyle: { backgroundColor: '#a5dfdf' },}}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Trips' }}
      />
      <Tabs.Screen
        name="categories"
        options={{ title: 'Categories' }}
      />
      <Tabs.Screen
        name="categories_add"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="category/[id]/edit"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="targets"
        options={{ title: 'Targets' }}
      />
      <Tabs.Screen
        name="targets_add"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="target/[id]/edit"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="insights"
        options={{ title: 'Insights' }}
      />
    </Tabs>
  );
}
