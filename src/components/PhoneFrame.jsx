import './PhoneFrame.css';

export default function PhoneFrame({ children }) {
  return (
    <div className="device-stage">
      <div className="iphone-frame" aria-label="Prévia mobile em iPhone">
        <span className="iphone-button power" aria-hidden="true" />
        <span className="iphone-button volume-up" aria-hidden="true" />
        <span className="iphone-button volume-down" aria-hidden="true" />
        <div className="iphone-screen">
          <div className="dynamic-island" aria-hidden="true" />
          {children}
        </div>
      </div>
    </div>
  );
}
