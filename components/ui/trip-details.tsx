import { StyleSheet, Text, View } from 'react-native';

type Props = {
  destination: string;
  startDate: string;
  endDate: string;
  compact?: boolean;
};

export default function TripDetails({ destination, startDate, endDate, compact = false }: Props) {
  return (
    <View style={[styles.card, compact ? styles.compactCard : null]}>
      <View style={[styles.detailBlockWide, compact ? styles.compactBlockWide : null]}>
        <Text style={styles.detailLabel}>Destination</Text>
        <Text style={[styles.detailValue, compact ? styles.compactValue : null]}>{destination}</Text>
      </View>
      <View style={styles.detailRow}>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>Start Date</Text>
          <Text style={[styles.detailValue, compact ? styles.compactValue : null]}>{startDate}</Text>
        </View>
        <View style={styles.detailBlock}>
          <Text style={styles.detailLabel}>End Date</Text>
          <Text style={[styles.detailValue, compact ? styles.compactValue : null]}>{endDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  compactCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
  },
  detailBlockWide: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  compactBlockWide: {
    backgroundColor: '#F8FAFC',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  compactValue: {
    fontSize: 13,
  },
});
