import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "../../app/styles/vdashstyle";

interface SummaryCardProps {
  label: string;
  value: string | number;
  note: string;
  width?: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, note, width }) => (
  <View style={[styles.summaryCard]}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardNote}>{note}</Text>
  </View>
);

export default SummaryCard;
