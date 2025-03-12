import { useLocation } from "react-router";

const ErrorPage = () => {
  const location = useLocation();
  const error = location.state?.error; // Get error from navigation state

  //   const { status, data } = error;
  //   console.log("status", status);
  //   console.log("data", data);

  console.log("error page", error);

  return <div>ErrorPage</div>;
};

export default ErrorPage;
