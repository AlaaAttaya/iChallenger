import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.css";

const CustomPrevArrow = ({ onClick }) => (
  <button onClick={onClick} className="arrow prev-arrow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 25 38"
      fill="none"
    >
      <path
        d="M19.2813 38L0.1375 19.2425L19.2813 0.485L25 6.34063L11.8337 19.2425L25 32.1444L19.2813 38Z"
        fill="#2FD671"
      />
    </svg>
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button onClick={onClick} className="arrow next-arrow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 25 38"
      fill="none"
    >
      <path
        d="M5.71875 0L24.8625 18.7575L5.71875 37.515L0 31.6594L13.1663 18.7575L0 5.85563L5.71875 0Z"
        fill="#2FD671"
      />
    </svg>
  </button>
);

const CardCarousel = ({
  cards,
  setwidth,
  setheight,
  carouseltitle,
  linkto,
}) => {
  const [slidesToShow, setSlidesToShow] = useState(4);
  const settings = {
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 4,

    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };
  const handleResize = () => {
    if (window.innerWidth <= 800) {
      setSlidesToShow(1);
    } else if (window.innerWidth >= 800 && window.innerWidth <= 1150) {
      setSlidesToShow(2);
    } else if (window.innerWidth >= 1150 && window.innerWidth <= 1550) {
      setSlidesToShow(3);
    } else {
      setSlidesToShow(5);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-title-wrapper">
        <span className="carousel-title">{carouseltitle}</span>
        <a className="A-link" href={linkto}>
          <span className="ViewAll">View All</span>
        </a>
      </div>
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div
            key={index}
            className="carousel-card"
            style={{
              width: setwidth,
              height: setheight,
            }}
          >
            {card}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardCarousel;
