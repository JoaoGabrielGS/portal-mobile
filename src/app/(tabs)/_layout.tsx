import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type TabConfig = {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
};

const TABS: TabConfig[] = [
  { name: 'index', title: 'Início', icon: 'home-outline', iconFocused: 'home' },
  { name: 'academico', title: 'Acadêmico', icon: 'book-outline', iconFocused: 'book' },
  { name: 'calendario', title: 'Calendário', icon: 'calendar-outline', iconFocused: 'calendar' },
  { name: 'financeiro', title: 'Financeiro', icon: 'card-outline', iconFocused: 'card' },
  { name: 'perfil', title: 'Perfil', icon: 'person-outline', iconFocused: 'person' },
];

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? tab.iconFocused : tab.icon} size={24} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
