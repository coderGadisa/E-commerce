import "./Loader.css";

function Loader({ size = "medium", text = "Loading..." }) {
  return (
    <div className="loader-wrapper">
      <div className={`spinner spinner--${size}`}></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export default Loader;
