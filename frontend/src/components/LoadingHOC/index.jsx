import React from "react";
import Loading from "../Loading";

const LoadingHOC = (Component) => (props) =>
  (
    <React.Suspense fallback={<Loading />}>
      <Component {...props} />
    </React.Suspense>
  );

export default LoadingHOC;
