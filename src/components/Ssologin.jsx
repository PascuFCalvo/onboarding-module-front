import { useState } from "react";
import axios from "axios";

let BASEURL = import.meta.env.VITE_BASEURL;
if (!BASEURL) {
  throw new Error("La variable VITE_BASEURL no está definida.");
}
console.log("Base URL:", BASEURL);
axios.defaults.baseURL = BASEURL;

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
        `${BASEURL}/auth/ssologin`,
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
