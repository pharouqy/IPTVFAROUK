import App from "./App";
import Footer from "./components/Footer";

const AppWrapper = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <App />
      </div>
    </div>
  );
};

export default AppWrapper;
