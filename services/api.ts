import AsyncStorage from "@react-native-async-storage/async-storage";
import SecureStore from "expo-secure-store";
const API_BASE_URL = "https://api.freeapi.app/api/v1/users";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

const TOKEN_KEY = "auth_token";

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.warn("AsyncStorage not available, token not stored", error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.warn("AsyncStorage not available, returning null", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn("SecureStore not available, token not removed", error);
  }
};

export const validateToken = async (): Promise<boolean> => {
  const token = await getToken();
  if (!token) return false;
  try {
    // Assuming there's a /me endpoint or similar for validation
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error");
  }
};

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error");
  }
};

export const fetchRandomUsers = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL.replace("/users", "/public/randomusers")}`,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error");
  }
};

export const fetchRandomProducts = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL.replace("/users", "/public/randomproducts")}`,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error");
  }
};
