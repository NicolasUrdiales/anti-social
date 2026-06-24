const profile = () => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null; }
