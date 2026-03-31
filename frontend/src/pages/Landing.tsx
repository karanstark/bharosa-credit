import React from "react";
import BharosaLandingPage from "../components/ui/fin-tech-landing-page";

interface LandingProps {
  onStart: () => void;
  onLogin: () => void;
  onSampleData: () => void;
  onSolutions?: () => void;
  onTrustEngine?: () => void;
  onCompliance?: () => void;
  onInsights?: () => void;
}

const Landing: React.FC<LandingProps> = ({
  onStart,
  onLogin,
  onSampleData,
  onSolutions,
  onTrustEngine,
  onCompliance,
  onInsights,
}) => {
  return (
    <BharosaLandingPage
      onStart={onStart}
      onLogin={onLogin}
      onSampleData={onSampleData}
      onSolutions={onSolutions}
      onTrustEngine={onTrustEngine}
      onCompliance={onCompliance}
      onInsights={onInsights}
    />
  );
};

export default Landing;
