const questions = [
  {
    id: 1,
    question: "친구들과 모인 자리에서 와인을 마실 때, 당신은 어떻게 행동하나요?",
    options: [
      { option: "A. 다른 사람들과 활발하게 대화를 나누며 분위기를 즐긴다.", personality: "E" },
      { option: "B. 조용히 앉아서 친구들과 깊은 대화를 나눈다.", personality: "I" },
    ],
  },
  {
    id: 2,
    question: "와인을 마시기 전에, 가장 중요한 것은 무엇인가요?",
    options: [
      { option: "A. 주변 사람들과 함께 분위기를 맞추며 와인을 고른다.", personality: "E" },
      { option: "B. 나만의 기분에 맞춰 와인을 고른다.", personality: "I" },
    ],
  },
  {
    id: 3,
    question: "와인 한 잔을 마시며 어떤 기분이 드나요?",
    options: [
      { option: "A. 다른 사람들과 함께 이야기를 나누며 즐긴다.", personality: "E" },
      { option: "B. 혼자만의 시간을 즐기며 와인의 향을 음미한다.", personality: "I" },
    ],
  },

  {
    id: 4,
    question: "식사와 함께 와인을 마실 때, 무엇을 가장 중요하게 생각하나요?",
    options: [
      { option: "A. 음식과 와인의 조화가 중요하다.", personality: "S" },
      { option: "B. 와인이 주는 전체적인 느낌이나 경험이 중요하다.", personality: "N" },
    ],
  },
  {
    id: 5,
    question: "와인을 고를 때, 어떤 기준을 더 우선시하나요?",
    options: [
      { option: "A. 와인의 품질이나 맛, 향 등 구체적인 요소에 집중한다.", personality: "S" },
      { option: "B. 와인을 통해 떠오르는 이야기나 독특한 경험을 중요시한다.", personality: "N" },
    ],
  },
  {
    id: 6,
    question: "와인을 마신 후, 기억에 남는 것은 무엇인가요?",
    options: [
      { option: "A. 와인의 맛이나 향이 입안에 남아 기억된다.", personality: "S" },
      { option: "B. 와인과 함께한 사람들과의 대화나 분위기가 기억에 남는다.", personality: "N" },
    ],
  },

  {
    id: 7,
    question: "와인 선택 시, 가장 중요하게 생각하는 점은 무엇인가요?",
    options: [
      { option: "A. 와인의 품질이나 가격 등 객관적인 기준을 중요시한다.", personality: "T" },
      { option: "B. 와인과 함께한 경험이나 그 분위기, 사람들과의 감정적 연결을 중요시한다.", personality: "F" },
    ],
  },
  {
    id: 8,
    question: "와인 마시기 전, 어떤 점을 고려하시나요?",
    options: [
      { option: "A. 와인의 종류와 특성을 미리 파악하고 고른다.", personality: "T" },
      { option: "B. 그날의 기분이나 분위기에 맞는 와인을 고른다.", personality: "F" },
    ],
  },
  {
    id: 9,
    question: "와인을 마신 후, 어떤 점이 기억에 남나요?",
    options: [
      { option: "A. 와인의 품질이나 맛, 그리고 그 특성들이 기억에 남는다.", personality: "T" },
      { option: "B. 와인과 함께한 사람들과의 감정적 교감이나 분위기가 기억에 남는다.", personality: "F" },
    ],
  },

  {
    id: 10,
    question: "와인을 고른 후, 어떻게 보관할까요?",
    options: [
      { option: "A. 와인의 맛을 최대로 즐기기 위해 온도나 조건을 잘 맞춘다.", personality: "J" },
      { option: "B. 그때그때 마시고 싶은 대로 보관하거나 특별한 규칙 없이 사용한다.", personality: "P" },
    ],
  },
  {
    id: 11,
    question: "와인을 마시기 전, 어떤 방식으로 준비하시나요?",
    options: [
      { option: "A. 와인과 함께할 음식이나 상황을 미리 계획하고 준비한다.", personality: "J" },
      { option: "B. 그때그때 기분에 맞는 와인을 즉흥적으로 고른다.", personality: "P" },
    ],
  },
  {
    id: 12,
    question: "와인 한 잔을 마신 후, 다음에는 어떻게 할까요?",
    options: [
      { option: "A. 그날의 와인과 함께한 시간을 되돌아보며 계획을 세운다.", personality: "J" },
      { option: "B. 그 순간에 맡겨 두고, 계속해서 흘러가는 대로 즐긴다.", personality: "P" },
    ],
  },
];

export default questions;
