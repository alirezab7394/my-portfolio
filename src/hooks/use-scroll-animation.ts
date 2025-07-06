import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef<HTMLElement>(null);

    const {
        threshold = 0.1,
        rootMargin = "0px 0px -100px 0px",
        triggerOnce = true,
    } = options;

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setHasAnimated(true);

                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce && hasAnimated) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, hasAnimated]);

    return { ref: elementRef, isVisible, hasAnimated };
}

// Custom hook for stagger animations
export function useStaggerAnimation(
    itemsCount: number,
    options: UseScrollAnimationOptions = {}
) {
    const [visibleItems, setVisibleItems] = useState<boolean[]>(
        new Array(itemsCount).fill(false)
    );
    const elementRef = useRef<HTMLElement>(null);

    const {
        threshold = 0.1,
        rootMargin = "0px 0px -50px 0px",
        triggerOnce = true,
    } = options;

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    // Stagger the animations
                    const staggerDelay = 100; // ms between each item

                    for (let i = 0; i < itemsCount; i++) {
                        setTimeout(() => {
                            setVisibleItems((prev) => {
                                const newItems = [...prev];
                                newItems[i] = true;
                                return newItems;
                            });
                        }, i * staggerDelay);
                    }

                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [itemsCount, threshold, rootMargin, triggerOnce]);

    return { ref: elementRef, visibleItems };
} 