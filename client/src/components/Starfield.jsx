export default function Starfield({ warp = false }) {
  return (
    <div className={`starfield ${warp ? "stars-warp" : ""}`}>
      <div className="stars-layer stars-small" />
      <div className="stars-layer stars-medium" />
      <div className="stars-layer stars-large" />
    </div>
  );
}
