import { StyleSheet, Dimensions } from "react-native";

export const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  screen: { flex: 1, flexDirection: screenWidth >= 1024 ? "row" : "column", backgroundColor: "#f5f5f5" },
  content: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 15 },

  pageTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#000" },

  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#2563eb33",
  },
  customerName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  commentText: { marginTop: 5, fontSize: 14, color: "#000" },

  actions: { marginTop: 10, flexDirection: "row", justifyContent: "flex-end" },
  deleteBtn: { backgroundColor: "red", borderRadius: 6, paddingVertical: 5, paddingHorizontal: 15 },
  deleteText: { color: "#fff", fontWeight: "bold" },

  menuBtn: { position: "absolute", top: 40, left: 20, zIndex: 20, backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 9 },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 260,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
    elevation: 10,
  },
  drawerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#2563eb" },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderRadius: 10, marginBottom: 8 },
  drawerText: { color: "#000", fontSize: 16, marginLeft: 10 },
});

export default styles;
