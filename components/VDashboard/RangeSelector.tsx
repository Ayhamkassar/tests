import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../app/styles/vdashstyle";

type Range = "يومي" | "أسبوعي" | "شهري";

interface RangeSelectorProps {
  currentRange: Range;
  setRange: (range: Range) => void;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ currentRange, setRange }) => {
  const ranges: Range[] = ["يومي", "أسبوعي", "شهري"];
  return (
    <View style={styles.rangeContainer}>
      {ranges.map((r) => (
        <TouchableOpacity
          key={r}
          style={[styles.rangeBtn, currentRange === r && styles.rangeBtnActive]}
          onPress={() => setRange(r)}
        >
          <Text style={[styles.rangeText, currentRange === r && styles.rangeTextActive]}>{r}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RangeSelector;
