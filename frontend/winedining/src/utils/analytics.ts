export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (window.gtag) {
    // console.log(" GA 이벤트 전송 중:", action, params); // 디버깅용
    window.gtag("event", action, params);
  } else {
    // console.warn(" gtag 미정의 상태! GA 스크립트가 아직 로드되지 않았습니다.");
  }
};
