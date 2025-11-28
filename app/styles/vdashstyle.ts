import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // SafeArea
  safe: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },

  // ScrollView Container
  container: {
    padding: 16,
  },

  // Range Selector
  rangeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  rangeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6eefc",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  rangeBtnActive: {
    backgroundColor: "#2563eb",
  },
  rangeText: {
    color: "#000",
  },
  rangeTextActive: {
    color: "#fff",
  },

  // Summary Cards
  summaryRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6eefc",
    marginHorizontal: 4,
  },
  cardLabel: {
    color: "#666",
    fontSize: 14,
  },
  cardValue: {
    color: "#2563eb",
    fontSize: 18,
    fontWeight: "800",
    marginVertical: 4,
  },
  cardNote: {
    color: "#999",
    fontSize: 12,
  },

  // Charts
  chartsArea: {
    marginBottom: 18,
  },
  chartsAreaDesktop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e6eefc",
  },
  chartTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  chartStyle: {
    borderRadius: 12,
  },

  // Sales List
  section: {
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  saleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e6eefc",
    marginBottom: 8,
  },
  saleId: {
    color: "#2563eb",
    fontWeight: "700",
  },
  saleCustomer: {
    color: "#000",
  },
  saleTotal: {
    color: "#000",
    fontWeight: "700",
  },
  saleDate: {
    color: "#666",
    fontSize: 12,
  },

  // Typography / Headers
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
  },
});

export default styles;
