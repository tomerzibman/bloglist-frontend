import axios from "axios";

const login = async (credentials) => {
  try {
    const response = await axios.post("/api/login", credentials);
    return response.data;
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
};

export default { login };
