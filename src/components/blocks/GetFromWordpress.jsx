import React, { useEffect, useState } from "react";
import SinglePost from "./SinglePost";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

const GetFromWordpress = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = queryString.parse(location.search);

  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);

  let urlPage = 1;
  if (searchParams.page !== undefined) {
    urlPage = searchParams.page;
  }

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [maxPage, setMaxPage] = useState(1);
  const [select, setSelect] = useState({ selectedValue: searchParams.sort });

  const WP_PARAMS = {};

  let sortData = ["title", "asc"];
  if (searchParams.sort !== undefined) {
    sortData = select.selectedValue.split("_");
  }

  //console.log(currentPage);

  const REST_WP_URL = `https://eltexsl.ru/wp-json/wp/v2/posts?page=${currentPage}&per_page=9&orderby=${sortData[0]}&order=${sortData[1]}`;

  function selectChange(event) {
    const selectedValue = event.target.value;
    // Обновление состояния компонента
    setSelect({ selectedValue });
    // Обновляем GET параметры в текущем URL
    const newSearch = queryString.stringify({
      ...searchParams,
      sort: selectedValue,
    });
    navigate(`?${newSearch}`);
  }

  useEffect(() => {
    setLoading(true);
    const newSearchParams = queryString.parse(location.search);
    setSelect({ selectedValue: newSearchParams.sort || "" });
    fetch(REST_WP_URL)
      .then((response) => {
        const getPages = response.headers.get("X-WP-TotalPages");
        setMaxPage(getPages);
        //console.log(getPages);
        return response.json();
      })
      .then((posts) => {
        const requests = posts.map((post) =>
          post.featured_media
            ? fetch(
                `https://eltexsl.ru/wp-json/wp/v2/media/${post.featured_media}`
              )
                .then((response) => response.json())
                .then((media) => {
                  return { ...post, imageUrl: media.source_url };
                })
                .catch((error) => {
                  console.error(error);
                  return post;
                })
            : Promise.resolve(post)
        );

        Promise.all(requests).then((data) => {
          setPosts(data);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [location.search]);

  function pagginationPrevClick() {
    setCurrentPage(+currentPage - 1);
    // Обновляем GET параметры в текущем URL
    const newSearch = queryString.stringify({
      ...searchParams,
      page: +currentPage - 1,
    });
    navigate(`?${newSearch}`);
  }

  function pagginationNextClick() {
    setCurrentPage(+currentPage + 1);
    // Обновляем GET параметры в текущем URL
    const newSearch = queryString.stringify({
      ...searchParams,
      page: +currentPage + 1,
    });
    navigate(`?${newSearch}`);
  }

  return (
    <div className="section__posts">
      <div className="container">
        <h2 className="md:text-4xl md:mb-8 text-2xl font-bold mb-4">
          Задача 1: Асинхронные запросы{" "}
        </h2>
        <div className="font-normal mb-8">
          В данной задаче посылаются асинхронный запросы к WordPress через REST
          API. Задача показывает навыки владения асинхронными запросами, а также
          навыки владения такими хуками как useState и useEffect. Так же имеется
          сортировка и пагинация работающая на основе React Router DOM и GET
          параметров.
        </div>
        <div className="text-sm mb-2">Выбрать сортировку:</div>
        <form>
          <select
            onChange={selectChange}
            value={select.selectedValue}
            className="select-wrapper  block w-full h-10 px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded shadow appearance-none focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-100"
          >
            <option value="title_asc">По заголовку (возрастание):</option>
            <option value="title_desc">По заголовку (убывание):</option>
            <option value="id_asc">По ID (возрастание):</option>
            <option value="id_desc">По ID (убывание):</option>
            <option value="date_asc">По дате публикации (возрастание):</option>
            <option value="date_desc"> По дате публикации (убывание):</option>
          </select>
        </form>

        {loading ? (
          <div className="flex justify-center items-center m-20">
            <div className="border-t-4 border-red-500 rounded-full w-12 h-12 mr-3 animate-spin"></div>
            <span className="text-red-500 font-bold text-xl">
              Загрузка постов из WordPress...
            </span>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="posts__items">
              {posts.map((value) => (
                <SinglePost key={value.id} props={value} />
              ))}
            </div>
            <div className="posts__navigation">
              {currentPage > 1 && (
                <button
                  className="md:m-5 posts__navigation__prev bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                  onClick={pagginationPrevClick}
                >
                  Назад
                </button>
              )}
              <button className="md:m-5 posts__navigation__current text-white font-bold py-2 px-4 rounded m-2">
                {currentPage}
              </button>
              {currentPage < maxPage && (
                <button
                  className="md:m-5 posts__navigation__prev bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                  onClick={pagginationNextClick}
                >
                  Вперед
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-4xl font-bold m-8 text-center">
            Посты не найдены.
          </div>
        )}
      </div>
    </div>
  );
};

export default GetFromWordpress;
