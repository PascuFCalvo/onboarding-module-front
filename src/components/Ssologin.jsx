import { useState } from "react";
import axios from "axios";

export const Ssologin = () => {
  const [usuario] = useState({
    email: "pascualfcalvo@gmail.com",
    name: "Pascual",
    redirectUrl: "https://academy.turiscool.com",
    avatar:
      "https://i.pinimg.com/474x/2e/4f/d3/2e4fd3fd8f2aff9c26b15c1f1c23b11e.jpg",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/ssologin",
        usuario
      );
      if (response.data.success) {
        window.location.href = response.data.url;
      } else {
        console.error("SSO login failed", response.data.errors);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Log In</button>
    </form>
  );
};

export default Ssologin;
