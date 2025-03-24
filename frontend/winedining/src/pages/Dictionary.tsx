import { useNavigate } from "react-router-dom";

function Dictionary() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)}>뒤로가기</button>

      <h1>알쓸신잡</h1>
    </div>
  );
}

export default Dictionary;

export {};
