import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EstimateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(id ? `/portal/${id}` : "/account", { replace: true });
  }, [id, navigate]);
  return null;
};

export default EstimateDetail;
