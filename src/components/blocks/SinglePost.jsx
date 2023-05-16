import React from "react";
import imgNoPhoto from "./../../assets/images/no-photo.jpg";

const SinglePost = ({ props }) => {
  const { title, content, date, imageUrl, id } = props;
  if (content.rendered.length > 100) {
    content.rendered = content.rendered.substring(0, 100);
    content.rendered += "...";
  }

  let dateFormat = new Date(date); // объект Date со значением "сейчас"
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  dateFormat = dateFormat.toLocaleDateString("ru-RU", options); // обнуляем часы, минуты, секунды и миллисекунды

  return (
    <div className="posts__item">
      <div className="posts__item__block-img">
        <div className="posts__item__id">ID = {id}</div>
        <img
          className="posts__item__img"
          src={imageUrl ? imageUrl : imgNoPhoto}
        />
      </div>
      <div className="posts__item__content">
        <div className="posts__item__date">{dateFormat}</div>
        <div
          className="posts__item__title"
          dangerouslySetInnerHTML={{ __html: title.rendered }}
        ></div>
        <div
          className="posts__item__desc"
          dangerouslySetInnerHTML={{ __html: content.rendered }}
        ></div>
      </div>
    </div>
  );
};

export default SinglePost;
