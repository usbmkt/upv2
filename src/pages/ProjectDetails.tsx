import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { formatDate, getStatusInfo, getPhaseColor } from "../lib/utils";
import { ProjectStatus } from "../types/project";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateProject, deleteProject } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = getProject(id || "");

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-6">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          to="/projects"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: ProjectStatus) => {
    updateProject(project.id, { status });
  };

  const handleDelete = () => {
    if (deleteProject(project.id)) {
      navigate("/projects");
    }
  };

  // Get phases sorted by start date
  const sortedPhases = Object.entries(project.phases).sort((a, b) => {
    return new Date(a[1].start).getTime() - new Date(b[1].start).getTime();
  });

  const { color, label } = getStatusInfo(project.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link
          to="/projects"
          className="text-muted-foreground hover:text-foreground mr-2"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">Project Details</h1>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{project.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
                {label}
              </span>
            </div>
            {project.client && (
              <p className="text-muted-foreground">{project.client}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={project.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as ProjectStatus)
                }
                className="border rounded-md py-2 pl-8 pr-4 bg-background"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Edit project"
            >
              <Edit size={18} />
            </button>

            <button
              onClick={() => setConfirmDelete(!confirmDelete)}
              className="p-2 rounded-md hover:bg-muted text-destructive transition-colors"
              title="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {confirmDelete && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-6">
            <p className="font-medium mb-2">
              Are you sure you want to delete this project?
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-muted hover:bg-muted/80 px-3 py-1 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Event Date</p>
              <p className="font-medium">
                {formatDate(project.eventDate, "MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {formatDate(project.createdAt, "MMMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>

        {project.description && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm bg-muted/50 p-3 rounded-md">
              {project.description}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-3">Launch Phases</h3>

          <div className="space-y-3">
            {sortedPhases.map(([key, phase]) => (
              <div
                key={key}
                className="flex items-center gap-3 bg-muted/30 rounded-md p-3"
              >
                <div
                  className="w-3 h-12 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getPhaseColor(key) }}
                />

                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">{key}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(new Date(phase.start), "MMM dd")} -{" "}
                    {formatDate(new Date(phase.end), "MMM dd, yyyy")}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {Math.round(
                    (new Date(phase.end).getTime() -
                      new Date(phase.start).getTime()) /
                      (1000 * 60 * 60 * 24) +
                      1,
                  )}{" "}
                  days
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Timeline Visualization</h3>

        <div className="relative pt-6 pb-2 mb-6">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-muted" />

          {sortedPhases.map(([key, phase], index) => {
            const startDate = new Date(sortedPhases[0][1].start).getTime();
            const endDate = new Date(
              sortedPhases[sortedPhases.length - 1][1].end,
            ).getTime();
            const totalDuration = endDate - startDate;

            const phaseStart = new Date(phase.start).getTime();
            const phaseEnd = new Date(phase.end).getTime();
            const phaseStartPosition =
              ((phaseStart - startDate) / totalDuration) * 100;
            const phaseEndPosition =
              ((phaseEnd - startDate) / totalDuration) * 100;
            const phaseWidth = phaseEndPosition - phaseStartPosition;

            return (
              <div key={key} className="relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-4 rounded-full phase-bar"
                  style={{
                    left: `${phaseStartPosition}%`,
                    width: `${phaseWidth}%`,
                    backgroundColor: getPhaseColor(key),
                  }}
                />

                <div
                  className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${phaseStartPosition}%` }}
                >
                  <div
                    className="w-3 h-3 rounded-full z-10 mb-1"
                    style={{ backgroundColor: getPhaseColor(key) }}
                  />

                  {index % 2 === 0 && (
                    <div className="text-xs text-muted-foreground whitespace-nowrap transform -rotate-45 origin-top-left mt-3 pt-2">
                      {formatDate(new Date(phase.start), "MMM dd")}
                    </div>
                  )}
                </div>
                {index === sortedPhases.length - 1 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${phaseEndPosition}%` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full z-10 mb-1"
                      style={{ backgroundColor: getPhaseColor(key) }}
                    />

                    <div className="text-xs text-muted-foreground whitespace-nowrap transform -rotate-45 origin-top-left mt-3 pt-2">
                      {formatDate(new Date(phase.end), "MMM dd")}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {sortedPhases.map(([key]) => (
            <div key={key} className="flex items-center gap-1 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getPhaseColor(key) }}
              />

              <span className="capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
