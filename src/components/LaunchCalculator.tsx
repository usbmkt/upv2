import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Calculator as CalcIcon } from "lucide-react";
import { LaunchCalculatorResult, PhaseConfig } from "../types/project";
import { defaultPhases, calculatePhaseDates } from "../lib/utils";
import LaunchResults from "./LaunchResults";

const LaunchCalculator = () => {
  const [phases, setPhases] = useState<{ [key: string]: PhaseConfig }>({
    ...defaultPhases,
  });
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [results, setResults] = useState<LaunchCalculatorResult | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Update phase duration
  const updatePhaseDays = (phaseKey: string, days: number) => {
    setPhases((prev) => ({
      ...prev,
      [phaseKey]: {
        ...prev[phaseKey],
        days: Math.max(1, days), // Minimum 1 day
      },
    }));
  };

  // Calculate dates based on event date and durations
  const calculateDates = () => {
    if (!eventDate) return;

    const calculatedPhases = calculatePhaseDates(eventDate, phases);

    setResults({
      launchModel: "Standard",
      eventDate,
      phases: calculatedPhases,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalcIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Launch Calculator</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Event Date</label>
          <div className="relative">
            <input
              type="text"
              value={eventDate ? format(eventDate, "MMMM dd, yyyy") : ""}
              readOnly
              className="w-full p-2 border rounded bg-background"
              onClick={() => setCalendarOpen(!calendarOpen)}
              placeholder="Select event date"
            />

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setCalendarOpen(!calendarOpen)}
            >
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </button>

            {calendarOpen && (
              <div className="absolute z-10 mt-1 bg-card border rounded-md shadow-lg p-3">
                <div className="calendar-wrapper">
                  {/* In a real implementation, this would be a date picker component */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = new Date();
                      day.setDate(day.getDate() + i);
                      return (
                        <button
                          key={i}
                          className="p-2 text-center rounded hover:bg-muted"
                          onClick={() => {
                            setEventDate(day);
                            setCalendarOpen(false);
                          }}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Launch Phases</h3>
          <div className="space-y-3">
            {Object.entries(phases).map(([key, phase]) => (
              <div key={key} className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm">{phase.name}</label>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    value={phase.days}
                    onChange={(e) =>
                      updatePhaseDays(key, parseInt(e.target.value) || 1)
                    }
                    className="w-full p-2 border rounded bg-background"
                  />
                </div>
                <div className="w-10 text-sm text-muted-foreground">days</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={calculateDates}
          disabled={!eventDate}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Calculate Timeline
        </button>
      </div>

      {results ? (
        <LaunchResults results={results} />
      ) : (
        <div className="bg-card rounded-lg border p-6 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <CalcIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />

            <p>Select an event date and calculate to see results</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchCalculator;
