// src/pages/SamplePage.tsx
import React from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";

const SamplePage: React.FC = () => {
  const markdownData = `
탄닌감은 와인을 마셨을 때 입안에서 느껴지는 떫은 맛을 말합니다.
이 맛은 와인 속에 있는 "**탄닌**"이라는 성분 때문에 발생합니다.
\n\n탄닌은 주로 포도의 껍질, 씨, 줄기에서 나오며,                                                                                                                                                                   
때로는 오크통에서 숙성하는 동안에도 생겨납니다.
### 와인에서 탄닌감이 강하면,
입안에서 떫고 거칠게 느껴질 수 있습니다.
주로 레드 와인에서 탄닌이 많이 나오는데,                           
그 이유는 포도의 껍질과 씨에서 나오는 탄닌이 와인의 맛을 더 복잡하고 깊게 만들어주기 때문입니다.                                               
### 시간이 지나면 부드러워지는 탄닌감
\n\n탄닌감이 강한 와인은 시간이 지나면서 점점 부드럽고 조화롭게 변하는 경향이 있습니다. 그래서 시간이 지나면 입 안에서 느껴지는 떫은 맛이 줄어들고, 와인의 전체적인 맛이 더 부드럽고 균형 잡히게 변합니다. 그래서 많은 사람들이 오래 숙성된 와인을 좋아할 수 있습니다.\n\n탄닌감은 와인 맛의 중요한 특징 중 하나로, 와인을 마실 때 그 맛을 더 풍부하고 다양하게 만들어 주는 중요한 요소입니다!\n

`;

  return (
    <div>
      <h1>마크다운 렌더링 예시</h1>
      <MarkdownRenderer markdownContent={markdownData} />
    </div>
  );
};

export default SamplePage;
