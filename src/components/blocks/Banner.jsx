import React from "react";

const Banner = ({ img }) => {
  return (
    <div className="section__banner">
      <div className="container">
        <div className="banner__content">
          <div className="banner__content__title">Привет, я Мытник Антон</div>
          <div className="banner__content__desc">
            Добро пожаловать на мой сайт портфолио! Я занимаюсь веб-разработкой
            уже несколько лет. Я увлечен своей работой и стремлюсь к
            совершенству в каждом проекте. Приглашаю вас ознакомиться с этим
            проектом реализованным на React!
          </div>
        </div>
      </div>

      <img className="banner__img" src={img} />
    </div>
  );
};

export default Banner;
