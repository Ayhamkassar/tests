import axios from "axios";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export const registerUser = async (data: RegisterData) => {
  return await axios.post("https://localhost:7084/api/User/register", {
    FullName: data.fullName,
    Email: data.email,
    PasswordHash: data.password,
    PhoneNumber: data.phone,
    hasAStore: false,
  });
};
