type MiddleTruncatedTextProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const MiddleTruncatedText = ({
  children,
  ...props
}: MiddleTruncatedTextProps) => {
  return (
    <div {...props}>
      <span>{children?.toString().substring(0, 4)}</span>
      <span>...</span>
      <span>
        {children
          ?.toString()
          .substring(
            children?.toString().length - 4,
            children?.toString().length
          )}
      </span>
    </div>
  );
};
