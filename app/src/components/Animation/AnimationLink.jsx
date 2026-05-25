import { useAnimatedNavigation } from "./hooks/useAnimatedNavigation";

const AnimationLink = ({ path, link, children, className, onMouseEnter, onMouseLeave, typo }) => {
  const navigate = useAnimatedNavigation();

  const resolveInternalHref = (internalLink) => {
    if (!internalLink) return null;

    console.log("internal link!");

    const rawSlug = internalLink?.slug?.current ?? internalLink?.slug;

    console.log("internal link!", internalLink);
    if (!rawSlug) return null;

    console.log("raw slug:", rawSlug);

    const slug = String(rawSlug).replace(/^\/+/, "");
    if (!slug) return null;

    if (internalLink?._type === "film") return `/films/${slug}`;
    return `/${slug}`;
  };

  let href;
  if (link) {
    href =
      link.type === "internal"
        ? resolveInternalHref(link.internalLink)
        : link.type === "external"
          ? link.url
          : link.type === "email"
            ? `mailto:${link.email}`
            : "#";
  } else {
    href = path;
  }

  if (!href || href === "#") return <>{children}</>;

  const isExternal = link?.type === "external";
  const isEmail = link?.type === "email";

  const handleClick = (e) => {
    // Preserve native behavior for external/email links and modified clicks.
    if (isExternal || isEmail || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

    e.preventDefault();
    navigate(href);
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      typo={typo}
    >
      {children}
    </a>
  );
};

export default AnimationLink;
