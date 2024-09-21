import { useFormContext } from "react-hook-form";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface MarkdownViewerProps {
  input?: string;
  index?: number;
  className?: string;
}

const MarkdownViewer = ({ className, index }: MarkdownViewerProps) => {
  const { watch } = useFormContext();
  const desc = watch(`questions.${index}.desc`);

  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        children={desc}
        className="prose"
      />
    </div>
  );
};

export default MarkdownViewer;
