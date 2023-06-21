import React from "react";

const Banner = ({ img }) => {
  return (
    <div className="section__banner">
      <div className="container">
        <div className="banner__content">
          <div className="banner__content__title">
            Приветствую! <br />Я Мытник Антон
          </div>
          <div className="banner__content__desc">
            Добро пожаловать на мой сайт портфолио. Ниже представлены задачи,
            которые я решил на React, используя различные библиотеки и знания,
            показывающий мой уровень владения React.
          </div>
        </div>
      </div>

      <img className="banner__img" src={img} />
    </div>
  );
};

export default Banner;
