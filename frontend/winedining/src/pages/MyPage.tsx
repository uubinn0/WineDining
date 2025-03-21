import React, { useState, useEffect } from "react";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditModal from "../components/Modal/EditModal";

function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={() => navigate("/home")}>홈으로가기</button>
      <button onClick={openModal}>회원관리모달열기</button>

      <h1>여기는 나의 페이지 공간입니다.</h1>

      <EditModal isOpen={isModalOpen} onClose={closeModal}></EditModal>
      <button onClick={() => navigate("/winesellerlist")}>와인셀러리스트</button>
      <button onClick={() => navigate("/wishlist")}>위시리스트</button>
      <button onClick={() => navigate("/test")}>와인취향테스트하기</button>
    </div>
  );
}

export default MyPage;

export {};
