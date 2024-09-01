import ApisByRiskScore from "./components/IpTableCard";
import TrafficByCountry from "./components/TrafficByCountry";

const Traffic = () => {
  return (
    <div className="mt-10">
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-5">
        <TrafficByCountry />
        <ApisByRiskScore />
      </div>
    </div>
  );
};

export default Traffic;
