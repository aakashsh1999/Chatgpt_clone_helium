import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

const Loading = () => {
  const override = {
    color: "white",
    loading: true,
  };

  return (
    <div>
      <PulseLoader
        color={override.color}
        loading={override.loading}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
