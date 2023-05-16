/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.js", "./src/**/*.jsx"],
  theme: {
    container: {
      center: true, // Центрирование содержимого по горизонтали
      padding: "15px", // Внутренний отступ контейнера
      screens: {
        sm: "576px", // Настройка точек перелома для контейнера
        md: "768px",
        lg: "992px",
        xl: "1200px",
      },
    },
  },
  plugins: [],
};
