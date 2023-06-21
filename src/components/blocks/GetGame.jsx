import React from "react";
import Game from "./Game";

const GetGame = () => {
  return (
    <div className="section__game">
      <div className="container">
        <h2 className="md:text-4xl md:mb-8 font-bold text-2xl mb-4">
          Задача 2: Создание игры
        </h2>
        <div className="md:mb-8 font-normal mb-4">
          В данном задании создана простенькая игра, которая показывает навыки
          владения хуками, стейтами и просто логикой. Прогресс игры хранится и
          сохраняется в localStorage, для того чтобы можно было продолжить игру
          после перезагрузки страницы.
        </div>
        <Game />
      </div>
    </div>
  );
};

export default GetGame;
