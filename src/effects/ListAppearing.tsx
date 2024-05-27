import { useTransition, easings } from "@react-spring/web";

export const useListAppearing = (array: { id: string; text: string }[]) => {
  const transitions = useTransition(array, {
    keys: (item) => item.id,
    from: {
      transform: "translateX(25%)",
      opacity: 0,
      backgroundColor: "var(--color-uilines)",
    },
    enter:
        // [
    //   {
    //     transform: "translateX(15%)",
    //     opacity: 0.5,
    //     backgroundColor: "var(--color-uilines)",
    //   },
      {
        transform: "translateX(0%)",
        opacity: 1,
        backgroundColor: "rgba(0, 0, 0, 0)",
        config: { duration: 300, easing: easings.easeOutCubic },
      },
    // ],
    // leave: {
    //   transform: "translateX(-100%)",
    //   backgroundColor: "rgba(0, 0, 0, 0.5)",
    //   opacity: 0,
    // },
    // config: { duration: 300, easing: easings.easeOutCubic },
  });

  return transitions;
};
