function Loader({ show }) {
  if (!show) return null;
  return (
    <>
      <div className="loader-overlay">
        <div className="loader"></div>
        <p>Loading, please wait...</p>
      </div>
    </>
  );
}
export default Loader;
