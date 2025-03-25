interface QuestionOption {
  option: string;
  personality: string;
}

interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "저녁에 와인을 고를 때, 어떤 상황을 더 중시하나요?",
    options: [
      { option: "A. 오늘의 기분과 와인 맛이 잘 맞는지 고려한다.", personality: "I (내향)" },
      { option: "B. 내가 먹을 음식에 딱 맞는 와인을 선택한다.", personality: "E (외향)" },
    ],
  },
  {
    id: 2,
    question: "모임에서 와인을 마실 때, 당신은 어떻게 마시나요?",
    options: [
      { option: "A. 천천히 한 모금씩 음미하며 와인의 맛을 즐긴다.", personality: "I (내향)" },
      { option: "B. 분위기 좋게 빠르게 한 잔씩 마시며 즐긴다.", personality: "E (외향)" },
    ],
  },
  {
    id: 3,
    question: "식사 중, 와인 맛을 제대로 즐기기 위해 가장 중요한 건 무엇인가요?",
    options: [
      { option: "A. 음식과 와인이 잘 어울리는지, 조화가 중요하다.", personality: "S (감각)" },
      { option: "B. 와인 자체의 맛이 뛰어나야 한다. 음식은 와인의 맛을 돋보이게 한다.", personality: "N (직관)" },
    ],
  },
  {
    id: 4,
    question: "와인을 고른 후, 어떻게 보관할까요?",
    options: [
      { option: "A. 와인이 최고로 맛있을 때를 위해 적절한 온도에 보관한다.", personality: "J (판단)" },
      { option: "B. 그날 당장 마실 거면 적당히 보관해 두고, 친구들과 한 번에 마신다.", personality: "P (인식)" },
    ],
  },
  {
    id: 5,
    question: "친구와 함께 와인을 마실 때, 어떤 스타일인가요?",
    options: [
      { option: "A. 와인의 맛을 음미하고, 차분한 대화를 나누며 마신다.", personality: "I (내향)" },
      { option: "B. 분위기를 띄우고, 신나게 대화를 주도하며 마신다.", personality: "E (외향)" },
    ],
  },
  {
    id: 6,
    question: "와인을 마신 후, 그 맛을 오래 기억하려면 어떻게 해야 할까요?",
    options: [
      { option: "A. 와인을 천천히 음미하며 향과 맛을 즐긴다.", personality: "S (감각)" },
      { option: "B. 친구들과 그 날의 경험을 이야기하면서 기억을 강화한다.", personality: "N (직관)" },
    ],
  },
  {
    id: 7,
    question: "다음 날 아침, 와인을 마신 후 몸 상태가 별로일 때, 어떻게 대처하나요?",
    options: [
      { option: "A. 과일 주스나 물을 많이 마시며 빠르게 회복하려 한다.", personality: "S (감각)" },
      { option: "B. 와인의 맛을 떠올리며 조금 더 여유를 둔다.", personality: "N (직관)" },
    ],
  },
  {
    id: 8,
    question: "와인을 마시고, 당신은 어떤 기분이 들까요?",
    options: [
      { option: "A. 차분하고 여유로운 기분이 든다.", personality: "I (내향)" },
      { option: "B. 활기차고 긍정적인 기분이 든다.", personality: "E (외향)" },
    ],
  },
  {
    id: 9,
    question: "다음 날 아침, 와인을 마신 후 가장 기억에 남는 것은 무엇인가요?",
    options: [
      { option: "A. 와인 자체의 풍미와 그 날의 기분.", personality: "S (감각)" },
      { option: "B. 와인과 함께한 사람들과 분위기.", personality: "N (직관)" },
    ],
  },
  {
    id: 10,
    question: "와인을 마시기 전에, 당신은 어떤 선택을 할까요?",
    options: [
      { option: "A. 와인의 역사나 제조 과정을 알아보고 고른다.", personality: "J (판단)" },
      { option: "B. 즉흥적으로 오늘의 기분에 맞는 와인을 고른다.", personality: "P (인식)" },
    ],
  },
  {
    id: 11,
    question: "와인을 마시고 나서, 당신은 어떤 경험을 더 하고 싶나요?",
    options: [
      { option: "A. 와인과 함께 여유로운 시간을 보내며 그 맛을 음미한다.", personality: "I (내향)" },
      { option: "B. 와인과 함께 분위기를 띄우고 활동적인 시간을 보낸다.", personality: "E (외향)" },
    ],
  },
  {
    id: 12,
    question: "와인을 마신 후, 어떤 행동을 더 즐기고 싶은가요?",
    options: [
      { option: "A. 혼자서 와인의 맛을 음미하며 조용히 시간을 보낸다.", personality: "I (내향)" },
      { option: "B. 친구들과 함께 와인에 대해 이야기하며 즐거운 시간을 보낸다.", personality: "E (외향)" },
    ],
  }
];

export default questions;
