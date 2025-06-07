import { useRef, useEffect, useState } from "react";
import { Project } from "../types/project";
import { formatDate, getPhaseColor, getDaysDifference } from "../lib/utils";

interface GanttChartProps {
  projects: Project[];
  selectedProject?: string;
  onProjectSelect?: (id: string) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });
  const [totalDays, setTotalDays] = useState(0);

  // Calculate the earliest start date and latest end date across all projects
  useEffect(() => {
    if (projects.length === 0) return;

    let minDate = new Date();
    let maxDate = new Date();
    let initialized = false;

    projects.forEach((project) => {
      Object.values(project.phases).forEach((phase) => {
        if (!initialized) {
          minDate = new Date(phase.start);
          maxDate = new Date(phase.end);
          initialized = true;
        } else {
          if (phase.start < minDate) minDate = new Date(phase.start);
          if (phase.end > maxDate) maxDate = new Date(phase.end);
        }
      });
    });

    // Add padding days
    const paddedMinDate = new Date(minDate);
    paddedMinDate.setDate(paddedMinDate.getDate() - 5);

    const paddedMaxDate = new Date(maxDate);
    paddedMaxDate.setDate(paddedMaxDate.getDate() + 5);

    setDateRange({ start: paddedMinDate, end: paddedMaxDate });
    setTotalDays(getDaysDifference(paddedMinDate, paddedMaxDate));
  }, [projects]);

  // Generate date headers for the timeline
  const generateDateHeaders = () => {
    if (totalDays === 0) return [];

    const headers = [];
    const currentDate = new Date(dateRange.start);

    for (let i = 0; i < totalDays; i++) {
      headers.push(
        <div key={i} className="text-xs text-center w-8 font-medium">
          {formatDate(currentDate, "dd")}
          {i % 5 === 0 && (
            <div className="text-xs font-normal text-muted-foreground -mt-1">
              {formatDate(currentDate, "MMM")}
            </div>
          )}
        </div>,
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return headers;
  };

  // Render a phase bar for the timeline
  const renderPhaseBar = (project: Project, phaseKey: string, phase: any) => {
    const phaseStart = getDaysDifference(dateRange.start, phase.start) - 1;
    const phaseDuration = getDaysDifference(phase.start, phase.end);
    const phaseWidth = Math.max((phaseDuration / totalDays) * 100, 1);
    const phaseLeft = (phaseStart / totalDays) * 100;

    return (
      <div
        key={`${project.id}-${phaseKey}`}
        className="absolute h-6 rounded phase-bar cursor-pointer"
        style={{
          backgroundColor: getPhaseColor(phaseKey),
          left: `${phaseLeft}%`,
          width: `${phaseWidth}%`,
          top: "4px",
        }}
        title={`${phaseKey}: ${formatDate(phase.start)} - ${formatDate(phase.end)}`}
      >
        {phaseDuration > 3 && (
          <span className="text-xs text-white px-1 truncate block leading-6 whitespace-nowrap">
            {phaseKey}
          </span>
        )}
      </div>
    );
  };

  if (projects.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center bg-card">
        <p className="text-muted-foreground">No projects to display</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Project Timeline</h3>
      </div>

      <div className="timeline-container overflow-x-auto pb-2">
        <div className="min-w-max">
          {/* Date headers */}
          <div className="flex border-b pl-40 py-2">
            {generateDateHeaders()}
          </div>

          {/* Projects and phases */}
          {projects.map((project) => (
            <div
              key={project.id}
              className={`flex border-b hover:bg-muted/50 ${
                project.id === selectedProject ? "bg-muted" : ""
              }`}
              onClick={() => onProjectSelect && onProjectSelect(project.id)}
            >
              <div className="w-40 p-2 flex-shrink-0 border-r">
                <div className="font-medium truncate">{project.name}</div>
                <div className="text-xs text-muted-foreground">
                  {project.client || "No client"}
                </div>
              </div>

              <div className="flex-1 relative h-14 p-2">
                {Object.entries(project.phases).map(([phaseKey, phase]) =>
                  renderPhaseBar(project, phaseKey, phase),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
