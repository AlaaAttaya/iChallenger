import config from "./config";

export const refreshToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const response = await fetch(`${config.base_url}/api/user/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const newToken = data.data.token;

      localStorage.setItem("token", newToken);
      return newToken;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const response = await fetch(`${config.base_url}/api/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data.data;
    } else {
      throw new Error("Token verification failed");
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    throw error;
  }
};
