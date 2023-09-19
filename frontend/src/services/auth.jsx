import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "./config";

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  const refreshToken = () => {
    fetch("http://localhost:8000/api/user/refresh", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        console.log(response);

        return response.json();
      })
      .then((data) => {
        const token = data.data.token;
        localStorage.setItem("token", token);
      })
      .catch((error) => {
        console.error("Token refresh failed:", error);
        navigate("/Login");
      });
  };

  useEffect(() => {
    refreshToken();
    const refreshInterval = setInterval(refreshToken, 360000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  const verifyToken = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch(`${config.base_url}api/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);
        const data = await response.json();
        const user = data.data;
        setProfileData(user);
      } catch (error) {
        console.error("Token verification failed:", error);
        navigate("/Login");
      }
    } else {
      navigate("/Login");
    }
  };

  useEffect(() => {
    verifyToken();
  }, [navigate]);

  return profileData;
};

export default ProfileComponent;
