// src/components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown 플러그인

interface MarkdownRendererProps {
  markdownContent: string; // 마크다운 데이터를 prop으로 받음
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownContent }) => {
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
    },
    h1: {
      fontWeight: "bold",  // 제목을 굵게
      fontSize: "2rem",
    },
    p: {
      fontSize: "1rem",
      color: "#333",
    },
    ul: {
      listStyleType: "square", // 목록의 스타일 설정
    },
    li: {
      marginBottom: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 style={styles.h1} {...props} />,
          p: ({ node, ...props }) => <p style={styles.p} {...props} />,
          ul: ({ node, ...props }) => <ul style={styles.ul} {...props} />,
          li: ({ node, ...props }) => <li style={styles.li} {...props} />,
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
