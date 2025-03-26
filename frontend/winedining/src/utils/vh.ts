// calc 함수 vh로 바꿔서 쓰면 됩니다. Home.tsx 참고 바람!!

export const vh = (value: number) => `calc(${value} * var(--custom-vh))`;
