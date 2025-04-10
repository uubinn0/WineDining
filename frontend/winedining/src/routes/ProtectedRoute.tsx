import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useLocation, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const publicPaths = ["/", "/MBTITest", "/MBTIresults"];

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);
  const isLoading = status === "loading";
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const isPublic = publicPaths.includes(location.pathname);

  useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
        navigate("/", { replace: true }); // 이동하게 하는 로직
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isPublic, navigate]);

  if (!isLoading && !isAuthenticated && !isPublic) {
    return (
      <>
        {showModal && (
          <div style={modalOverlay}>
            <div style={modalContent}>
              <p>⚠️ 로그인 후 이용해주세요!</p>
            </div>
          </div>
        )}
      </>
    );
  }

  if (isLoading) {
    return null; // 또는 로딩 스피너 보여줘도 됨
  }
  return <>{children}</>;
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalContent: React.CSSProperties = {
  backgroundColor: "#2a0e35",
  color: "#fff",
  padding: "24px 32px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  border: "3px solid #d4b27a",
  textAlign: "center",
};

export default ProtectedRoute;
