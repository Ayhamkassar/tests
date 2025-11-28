import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import styles from "../../app/styles/vdashstyle";

interface ChartsSectionProps {
  range: string;
  barData: { labels: string[]; values: number[]; colors: string[] };
  pieData: any[];
  chartsWidth: number;
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => "#000",
  propsForBackgroundLines: { stroke: "#f0f0f0" },
};

const ChartsSection: React.FC<ChartsSectionProps> = ({ range, barData, pieData, chartsWidth }) => {
  return (
    <View style={styles.chartsArea}>
      <View style={[styles.chartCard, { width: chartsWidth }]}>
        <Text style={styles.chartTitle}>{range} — المبيعات</Text>
        <BarChart
          data={{
            labels: barData.labels,
            datasets: [{ data: barData.values, colors: barData.colors.map((c) => () => c) }],
          }}
          yAxisSuffix=""
          width={chartsWidth - 20}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel="ل.س"
          fromZero
          showBarTops={false}
          withCustomBarColorFromData
          flatColor
          style={styles.chartStyle}
        />
      </View>

      <View style={[styles.chartCard, { width: chartsWidth }]}>
        <Text style={styles.chartTitle}>توزيع الفئات</Text>
        <PieChart
          data={pieData as any}
          width={chartsWidth - 20}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chartStyle}
        />
      </View>
    </View>
  );
};

export default ChartsSection;
