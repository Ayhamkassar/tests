import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  // Gradient الخلفية
  gradient: { flex: 1 },

  // Container
  container: { flex: 1, flexDirection: width < 1024 ? "column" : "row-reverse" },

  // Left Panel
  leftPanel: {
    flex: 1,
    backgroundColor: "#2563eb",
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
    borderBottomRightRadius: width < 1024 ? 0 : 60,
    borderTopRightRadius: width < 1024 ? 0 : 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  welcome: { color: "#fff", fontSize: 32, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  desc: { color: "#e0e7ef", fontSize: 16, textAlign: "center", lineHeight: 24 },

  // Right Panel
  rightPanel: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 40,
    justifyContent: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    margin: width < 1024 ? 20 : 40,
  },

  // Input
  inputWrapper: { marginTop: 20 },
  label: { fontSize: 16, color: "#222", marginBottom: 8, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    textAlign: "right",
  },

  // Buttons
  confirmBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  confirmBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  sendBtn: {
    backgroundColor: "transparent",
    borderColor: "#3b82f6",
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 12,
  },
  sendBtnText: { color: "#3b82f6", fontSize: 16, fontWeight: "bold" },
});
