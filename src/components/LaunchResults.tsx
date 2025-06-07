import { format } from "date-fns";
import { Calendar, Download } from "lucide-react";
import { LaunchCalculatorResult } from "../types/project";
import { getPhaseColor } from "../lib/utils";

interface LaunchResultsProps {
  results: LaunchCalculatorResult;
}

const LaunchResults: React.FC<LaunchResultsProps> = ({ results }) => {
  if (!results) return null;

  const sortedPhases = Object.entries(results.phases).sort((a, b) => {
    return new Date(a[1].start).getTime() - new Date(b[1].start).getTime();
  });

  return (
    <div className="bg-card rounded-lg border p-6 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Launch Timeline</h2>
        </div>
        <button
          className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => {
            /* Implement export functionality */
          }}
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm border-b pb-2">
          <span className="font-medium">Launch Model:</span>
          <span>{results.launchModel}</span>
        </div>
        <div className="flex items-center justify-between text-sm border-b py-2">
          <span className="font-medium">Event Date:</span>
          <span>{format(new Date(results.eventDate), "MMMM dd, yyyy")}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <h3 className="text-sm font-medium">Launch Phases Timeline</h3>

        {sortedPhases.map(([key, phase]) => (
          <div key={key} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: getPhaseColor(key) }}
            />

            <div className="flex-1">
              <div className="text-sm font-medium capitalize">{key}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(phase.start), "MMM dd")} -{" "}
                {format(new Date(phase.end), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative pt-6 pb-2">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-muted" />

        {sortedPhases.map(([key, phase], index) => {
          const startDate = new Date(sortedPhases[0][1].start).getTime();
          const endDate = new Date(
            sortedPhases[sortedPhases.length - 1][1].end,
          ).getTime();
          const totalDuration = endDate - startDate;

          const phaseStart = new Date(phase.start).getTime();
          const phasePosition =
            ((phaseStart - startDate) / totalDuration) * 100;

          return (
            <div
              key={key}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${Math.max(0, Math.min(100, phasePosition))}%` }}
            >
              <div
                className="w-3 h-3 rounded-full z-10 mb-1"
                style={{ backgroundColor: getPhaseColor(key) }}
              />

              {(index === 0 ||
                index === sortedPhases.length - 1 ||
                index % 2 === 0) && (
                <div className="text-xs text-muted-foreground whitespace-nowrap transform -rotate-45 origin-top-left mt-2">
                  {format(new Date(phase.start), "MMM dd")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t">
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded w-full transition-colors">
          Save as Project
        </button>
      </div>
    </div>
  );
};

export default LaunchResults;
