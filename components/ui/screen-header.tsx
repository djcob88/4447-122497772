import { StyleSheet, Text, View, Image } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export default function ScreenHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoShell}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  logoShell: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'rgba(148, 163, 184, 0.35)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    overflow: 'hidden',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});
