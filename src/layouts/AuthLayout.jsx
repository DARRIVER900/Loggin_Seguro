import { Outlet } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return children || <Outlet />;
};

export default AuthLayout;
