import axios from "axios";

export const loginRequest = async (email: string, password: string) => {
  const res = await axios.post("https://localhost:7084/api/User/login", {
    Email: email,
    PasswordHash: password,
  });
  return res.data;
};
