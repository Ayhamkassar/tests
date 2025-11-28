import React from "react";
import { FlatList, View, Text } from "react-native";
import styles from "../../app/styles/vdashstyle";

interface Sale {
  id: string;
  customer: string;
  total: number;
  date: string;
}

interface SalesListProps {
  sales: Sale[];
  currency: (v: number) => string;
}

const SalesList: React.FC<SalesListProps> = ({ sales, currency }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>آخر المبيعات</Text>
    <FlatList
      data={sales}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.saleRow}>
          <View>
            <Text style={styles.saleId}>#{item.id}</Text>
            <Text style={styles.saleCustomer}>{item.customer}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.saleTotal}>{currency(item.total)}</Text>
            <Text style={styles.saleDate}>{item.date}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  </View>
);

export default SalesList;
