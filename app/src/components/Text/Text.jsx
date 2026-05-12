import { PortableText } from "@portabletext/react";
import AnimationLink from "@/components/Animation/AnimationLink";

const Text = ({ text, typo, className, onClick, style }) => {
  if (!Array.isArray(text)) {
    return text ? (
      <p typo={typo} className={className} onClick={onClick} style={style}>
        {text}
      </p>
    ) : null;
  }

  return (
    <div className={className} typo={typo} onClick={onClick} style={style}>
      <PortableText
        value={text}
        components={{
          marks: {
            link: ({ value, children }) => {
              if (!value) return children;

              return <AnimationLink link={value}>{children}</AnimationLink>;
            },
          },
        }}
      />
    </div>
  );
};

export default Text;
