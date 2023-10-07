type MiddleTruncatedTextProps = {
  children: React.ReactNode;
  length?: number;
  className?: string;
};

export const MiddleTruncatedText = ({
  children,
  length = 20,
  className,
}: MiddleTruncatedTextProps) => {
  if (!children) return null;
  const text = children as string;
  let truncatedText = text;
  if (text.length >= length) {
    truncatedText = `${text.slice(0, 12)}...${text.slice(-8)}`;
  }

  return <div className={className}>{truncatedText}</div>;
};
