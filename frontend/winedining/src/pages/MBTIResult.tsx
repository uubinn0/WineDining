import React from "react";
import { useLocation } from "react-router-dom"; // useLocation 훅 임포트

// 성격 유형 점수의 타입을 정의
interface Scores {
  E: number;
  I: number;
  S: number;
  N: number;
  F: number;
  T: number;
  P: number;
  J: number;
}

function MBTIResults() {
  const location = useLocation(); // useLocation을 통해 location 객체 가져오기
  const { E, I, S, N, F, T, P, J }: Scores = location.state || {}; // location.state의 타입을 명시적으로 정의

  // 성격 유형 계산
  const personalityType = `${E > I ? "E" : "I"}${S > N ? "S" : "N"}${F > T ? "F" : "T"}${P > J ? "P" : "J"}`;

  return (
    <div style={styles.container}>
      <div>결과 페이지</div>
      <h2>당신의 MBTI 유형은 {personalityType}입니다!</h2>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "white",
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
    display: "flex",
  },
};

export default MBTIResults;
