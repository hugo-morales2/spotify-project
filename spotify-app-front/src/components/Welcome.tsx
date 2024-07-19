const Welcome = () => {
  const handleRedirect = () => {
    window.location.replace("http://localhost:5000/login");
  };
  return (
    <>
      <h1>Spotify App</h1>
      <div className="card">
        <button onClick={handleRedirect}>Log in with Spotify</button>
      </div>
    </>
  );
};

export default Welcome;
