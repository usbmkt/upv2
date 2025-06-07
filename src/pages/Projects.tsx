import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { formatDate, getStatusInfo } from "../lib/utils";

const Projects = () => {
  const { projects, loading } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter projects based on search query and status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client &&
        project.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.description &&
        project.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          to="/calculator"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 py-2 pr-4 border rounded-md bg-background"
          />
        </div>
        <div className="flex items-center gap-2 min-w-48">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-grow border rounded-md py-2 px-3 bg-background"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const { color, label } = getStatusInfo(project.status);

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-card border rounded-lg p-4 hover:border-primary transition-colors project-card"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
                    {label}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {project.client || "No client"}
                </div>
                {project.description && (
                  <p className="text-sm mt-2 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-sm mt-2">
                  <Calendar size={14} className="text-primary" />

                  <span>
                    Event:{" "}
                    {formatDate(new Date(project.eventDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Created:{" "}
                  {formatDate(new Date(project.createdAt), "MMM dd, yyyy")}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No projects found</p>
          <Link
            to="/calculator"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Create your first project
          </Link>
        </div>
      )}
    </div>
  );
};

export default Projects;
