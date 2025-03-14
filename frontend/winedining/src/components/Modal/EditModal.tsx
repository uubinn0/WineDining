import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
// import { updateNickName, deleteAccount } from "../../store/slices/authSlice";

/* 닉네임 변경, 회원탈퇴 모달임 
남은 작업 내용: */
/* 모달 형식으로 띄워지게끔 만들어야됨. */

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditModal = ({ isOpen, onClose }: EditModalProps) => {
  const [nickname, setNickname] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  /* 밑에 코드는 추후 authSlice 수정 후 추가 */
  //   const user = useSelector((state: RootState) => state.auth.user);

  if (!isOpen) return null;

  return (
    <div>
      <h2>닉네임, 회원탈퇴 모달</h2>
      <p>닉네임 회원탈퇴 모달입니다.</p>
    </div>
  );
};

export default EditModal;
