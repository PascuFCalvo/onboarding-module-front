const LogoutPage = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
  return null;
};

export default LogoutPage;
