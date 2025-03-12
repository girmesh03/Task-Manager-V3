import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearError } from "../redux/features/errorSlice";

const ErrorHandler = () => {
  const error = useSelector((state) => state.error);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      navigate("/error", { state: { error } }); // Redirect with error details
      dispatch(clearError()); // Clear error after redirect
    }
  }, [error, navigate, dispatch]);

  return null; // This component does not render anything
};

export default ErrorHandler;
