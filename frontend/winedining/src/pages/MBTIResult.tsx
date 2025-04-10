import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Homebackground from "../assets/images/background/Home.png";
import winemenu from "../assets/images/modal/winemenu.png";
import { vh } from "../utils/vh";
import { wineMbti } from "../data/MBTIresult";
import defaultImage from "../assets/images/winesample/MBTIimage/defaultChardonnay.png";
import { trackEvent } from "../utils/analytics";
import kakao from "../assets/icons/kakao.png";
import google from "../assets/icons/google.png";
import link from "../assets/icons/link.png";

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

declare global {
  interface Window {
    Kakao: any;
  }
}

function MBTIResults() {
  const location = useLocation();
  const from = location.state?.from;
  const { E, I, S, N, F, T, P, J }: Scores = location.state || {};

  const personalityType = `${E > I ? "E" : "I"}${S > N ? "S" : "N"}${F > T ? "F" : "T"}${P > J ? "P" : "J"}`;
  const mbtiDictionary: Record<string, number> = {
    ISTJ: 1,
    ISFJ: 2,
    INFJ: 3,
    INTJ: 4,
    ISTP: 5,
    ISFP: 6,
    INFP: 7,
    INTP: 8,
    ESTP: 9,
    ESFP: 10,
    ENFP: 11,
    ENTP: 12,
    ESTJ: 13,
    ESFJ: 14,
    ENFJ: 15,
    ENTJ: 16,
  };
  const matchedWineId = mbtiDictionary[personalityType];
  const matchedWine = wineMbti.find((wine) => wine.id === matchedWineId);
  const bestWine = matchedWine ? wineMbti.find((wine) => wine.id === matchedWine.best) : null;
  const worstWine = matchedWine ? wineMbti.find((wine) => wine.id === matchedWine.worst) : null;

  const nav = useNavigate();

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_API_KAKAO);
    }
  }, []);

  const shareToKakao = () => {
    const shareUrl = "https://winedining.store";
    if (!window.Kakao?.Share) {
      alert("카카오톡 공유 기능을 사용할 수 없습니다.");
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "와인다이닝",
        description: "지금 바로 와인 다이닝 사이트에서 다양한 정보를 확인해보세요!",
        imageUrl: "https://winedining-s3.s3.ap-northeast-2.amazonaws.com/kakao_share_image.png",
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: "사이트 방문하기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  };

  const handleKakaoLogin = () => {
    trackEvent("mainpage_kakao_login_click", { provider: "KAKAO" });
    localStorage.setItem("provider", "KAKAO");
    window.location.href = "https://winedining.store/api/v1/auth/oauth2/authorization/kakao";
  };

  const handleGoogleLogin = () => {
    trackEvent("mainpage_google_login_click", { provider: "GOOGLE" });
    localStorage.setItem("provider", "GOOGLE");
    window.location.href = "https://winedining.store/api/v1/auth/oauth2/authorization/google";
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <img src={winemenu} alt="와인 메뉴판" style={styles.menuImage} />
          <div style={styles.title}>{matchedWine?.ko_name}</div>
          <ul style={styles.wineList}>
            {matchedWine && (
              <li style={styles.wineItem}>
                <div style={styles.wineImageWrapper}>
                  <img src={matchedWine.image || defaultImage} alt={matchedWine.ko_name} style={styles.wineImage} />
                </div>
                <div style={styles.wineText}>
                  <div style={styles.engName}>{matchedWine.eng_name}</div>
                  <div style={styles.content}>{matchedWine.content}</div>
                  <div style={styles.matchingContainer}>
                    <div style={styles.matching}>
                      <div style={styles.matchingtitle}>나랑 찰떡궁합</div>
                      <img src={bestWine?.image || defaultImage} alt="best" style={styles.wineMatchingImg} />
                      <div style={styles.matchingName}>{bestWine?.ko_name || "N/A"}</div>
                    </div>
                    <div style={styles.matching}>
                      <div style={styles.matchingtitle}>살짝쿵 안맞아</div>
                      <img src={worstWine?.image || defaultImage} alt="worst" style={styles.wineMatchingImg} />
                      <div style={styles.matchingName}>{worstWine?.ko_name || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </li>
            )}
          </ul>

          <div style={styles.actionContainer}>
            <button style={styles.shareButton} onClick={() => nav(from === "mypage" ? "/mypage" : "/")}>
              {from === "mypage" ? "마이페이지" : "홈으로 이동"}
            </button>
            {from !== "mypage" && (
              <>
                <div style={styles.loginText}>로그인하고 더 많은 와인을 즐겨보세요!</div>
                <div style={styles.loginButtonWrapper}>
                  <button onClick={handleKakaoLogin} style={styles.loginBtn}>
                    <img src={kakao} alt="카카오" style={styles.loginIcon} />
                  </button>
                  <button onClick={handleGoogleLogin} style={styles.loginBtn}>
                    <img src={google} alt="구글" style={styles.loginIcon} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button onClick={shareToKakao} style={styles.linkBtn}>
          <img src={link} alt="link" style={styles.icon} />
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundImage: `url(${Homebackground})`,
    backgroundSize: "contain",
    width: "100vw",
    maxWidth: "430px",
    height: "calc(100 * var(--custom-vh))",
    margin: "0 auto",
    position: "relative",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    paddingTop: vh(3),
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(39, 31, 31, 0.5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "70%",
    maxWidth: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  menuImage: {
    position: "absolute",
    width: vh(48),
    height: vh(85),
    objectFit: "fill",
    zIndex: -1,
  },
  title: {
    fontSize: vh(2.5),
    marginTop: vh(13),
    fontFamily: "Galmuri7",
  },
  wineList: {
    listStyle: "none",
    padding: 0,
  },
  wineItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  wineImageWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  wineImage: {
    width: vh(13),
    objectFit: "contain",
  },
  wineText: {
    flex: 1,
    fontSize: vh(1.8),
  },
  engName: {
    fontSize: vh(2),
    marginTop: vh(1),
    fontFamily: "Galmuri7",
    textAlign: "center",
  },
  content: {
    padding: vh(2),
  },
  matchingContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
  matching: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: vh(1),
    textAlign: "center",
  },
  matchingtitle: {
    fontWeight: "bold",
    textDecoration: "underline",
    textDecorationColor: "#333",
    textDecorationThickness: vh(0.3),
    marginBottom: vh(1),
    textUnderlineOffset: vh(0.6),
  },
  wineMatchingImg: { width: vh(10) },
  matchingName: { fontFamily: "Galmuri7" },
  actionContainer: {
    marginTop: vh(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  shareButton: {
    padding: `${vh(1.5)} ${vh(3)}`,
    backgroundColor: "#fff",
    minWidth: "20vh",
    marginTop: "2.0vh",
    border: "none",
    borderRadius: vh(1),
    fontFamily: "Galmuri7",
    fontSize: vh(1.8),
    boxShadow: "0 0.3vh 0.8vh rgba(0,0,0,0.3)",
    cursor: "pointer",
  },
  linkBtn: {
    position: "fixed",
    bottom: vh(3.5),
    right: vh(3.5),
    width: vh(3.5),
    height: vh(3.5),
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "none",
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  icon: {
    width: "90%",
    height: "90%",
    objectFit: "contain",
  },
  loginText: {
    fontSize: "1.2vh",
    color: "#ccc",
    marginTop: vh(1.5),
    textAlign: "center",
  },
  loginButtonWrapper: {
    marginTop: vh(1.2),
    display: "flex",
    gap: vh(2),
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtn: {
    width: vh(5.5),
    height: vh(5.5),
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 0.3vh 0.6vh rgba(0,0,0,0.3)",
    cursor: "pointer",
    padding: 0,
  },
  loginIcon: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

export default MBTIResults;
