const LogoutPage = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
  return null;
};

export default LogoutPage;
