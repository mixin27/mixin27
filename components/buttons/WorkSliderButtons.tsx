"use client";

import { useSwiper } from "swiper/react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { FunctionComponent } from "react";

type Props = {
  containerStyles: string | undefined;
  btnStyles: string | undefined;
  iconStyles: string | undefined;
};

const WorkSliderButtons: FunctionComponent<Props> = ({
  containerStyles,
  btnStyles,
  iconStyles,
}) => {
  const swiper = useSwiper();

  return (
    <div className={containerStyles}>
      <button className={btnStyles} onClick={() => swiper.slidePrev()}>
        <PiCaretLeftBold className={iconStyles} />
      </button>
      <button className={btnStyles} onClick={() => swiper.slideNext()}>
        <PiCaretRightBold className={iconStyles} />
      </button>
    </div>
  );
};

export default WorkSliderButtons;
