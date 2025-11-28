import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  // Gradient
  gradient: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  container: { flex: 1, flexDirection: width < 1024 ? "column" : "row-reverse" },

  // Panels
  rightPanel: { flex: 1, backgroundColor: "#fff", padding: 40, justifyContent: "center", alignItems: "center" },
  leftPanel: { flex: 1, backgroundColor: "#2563eb", alignItems: "center", padding: 24 },

  // Logo & Text
  logo: { width: 150, height: 150, marginBottom: 24, borderRadius: 40 },
  welcome: { color: "#2563eb", fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  desc: { color: "#2563eb", fontSize: 16, textAlign: "center" },

  // Form
  formContainer: { width: "100%", maxWidth: 400, paddingHorizontal: 20 },
  inputWrapper: { marginTop: 16 },
  label: { fontSize: 16, color: "#fff", fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 15,
    padding: 15,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Buttons
  loginBtn: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  registerBtn: { backgroundColor: "transparent", borderColor: "#fff", borderWidth: 2, padding: 16, borderRadius: 15, alignItems: "center", marginTop: 16 },
  registerText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Error
  errorContainer: { backgroundColor: "#fee2e2", borderColor: "#f87171", borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: "#dc2626", fontSize: 14, textAlign: "center", fontWeight: "500" },
});
