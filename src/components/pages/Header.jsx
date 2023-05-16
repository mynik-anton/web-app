import { NavLink } from "react-router-dom";

const checkActive = ({ isActive }) =>
  isActive ? "header__link header__link-active" : "header__link";

const Header = () => {
  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="header__menu">
            <NavLink className={checkActive} to="." end>
              Главная
            </NavLink>
            <NavLink className={checkActive} to="about">
              Обо мне
            </NavLink>
            <NavLink className={checkActive} to="contacts">
              Контакты
            </NavLink>
            <NavLink className={checkActive} to="courses">
              Навыки и опыт
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
