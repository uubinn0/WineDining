import React from "react";

/* 올바르지 않은 페이지로 이동했을때 뜨는 페이지 
추후 디자인 수정 필요 
*/

const ErrorPage = () => {
  return (
    <div style={style.ErrorPage}>
      <h1>404-요청하신 페이지를 찾을 수 없습니다.</h1>
      <p>요청하신 페이지는 존재하지 않거나, 이동한 페이지가 없습니다.</p>
    </div>
  );
};

const style: { [key: string]: React.CSSProperties } = {
  ErrorPage: {
    textAlign: "center",
    marginTop: "50px",
  },
};

export default ErrorPage;
