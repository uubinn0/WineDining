// src/components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  markdownContent: string;
  customStyle?: React.CSSProperties;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownContent, customStyle }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => <p style={customStyle} {...props} />,
        li: ({ node, ...props }) => <li style={customStyle} {...props} />,
        ul: ({ node, ...props }) => <ul style={{ paddingLeft: "2.2vh" }} {...props} />,
        strong: ({ node, ...props }) => <strong style={{ color: "white", fontWeight: "bold" }} {...props} />,
        h3: ({ node, ...props }) => (
          <h3 style={{ color: "#D6BA91", fontSize: "1.8vh", margin: "1.4vh 0" }} {...props} />
        ),
      }}
    >
      {markdownContent}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
