import LaunchCalculator from "../components/LaunchCalculator";

const Calculator = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Launch Calculator</h1>
      </div>

      <div>
        <LaunchCalculator />
      </div>
    </div>
  );
};

export default Calculator;
