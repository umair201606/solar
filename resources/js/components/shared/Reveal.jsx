import { useEffect, useRef, useState } from "react";

/**
 * Reveal Component
 * Animates children as they scroll into view.
 * Supported animations: "fade-up", "fade-down", "fade-left", "fade-right", "scale-up"
 */
export default function Reveal({
  children,
  animation = "fade-up",
  duration = "1000ms",
  delay = "0ms",
  once = true,
  threshold = 0.1,
  className = "",
  inline = false,
  slideOffset = 50, // customizable slide distance in px
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [once, threshold]);

  const getAnimationStyles = () => {
    // Ultra smooth premium hardware-accelerated cubic-bezier ease
    const transition = `opacity ${duration} cubic-bezier(0.16, 1, 0.3, 1) ${delay}, transform ${duration} cubic-bezier(0.16, 1, 0.3, 1) ${delay}`;

    if (isVisible) {
      return {
        opacity: 1,
        transform: "translate(0, 0) scale(1)",
        transition,
      };
    }

    let transform = "translate(0, 0)";
    if (animation === "fade-up") transform = `translateY(${slideOffset}px)`;
    else if (animation === "fade-down") transform = `translateY(-${slideOffset}px)`;
    // fade-left starts from positive X (right side) and enters left
    else if (animation === "fade-left") transform = `translateX(${slideOffset}px)`;
    // fade-right starts from negative X (left side) and enters right
    else if (animation === "fade-right") transform = `translateX(-${slideOffset}px)`;
    else if (animation === "scale-up") transform = "scale(0.95)";

    return {
      opacity: 0,
      transform,
      transition,
    };
  };

  const Component = inline ? "span" : "div";

  return (
    <Component
      ref={elementRef}
      style={getAnimationStyles()}
      className={className}
    >
      {children}
    </Component>
  );
}
