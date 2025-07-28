import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Calendar, CheckCircle2, Clock } from "lucide-react";

export function TasksOverview() {
  const tasks = [
    {
      id: 1,
      title: "Irrigation System Maintenance",
      farm: "North Farm",
      dueDate: "Today",
      priority: "high",
      status: "pending",
      assignee: "John Smith",
    },
    {
      id: 2,
      title: "Livestock Health Check",
      farm: "South Farm",
      dueDate: "Tomorrow",
      priority: "medium",
      status: "in-progress",
      assignee: "Sarah Johnson",
    },
    {
      id: 3,
      title: "Fertilizer Application",
      farm: "East Field",
      dueDate: "Jan 20",
      priority: "low",
      status: "pending",
      assignee: "Mike Wilson",
    },
    {
      id: 4,
      title: "Equipment Inspection",
      farm: "West Farm",
      dueDate: "Jan 22",
      priority: "medium",
      status: "completed",
      assignee: "Tom Brown",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center space-x-4 p-3 border rounded-lg"
        >
          <Checkbox />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{task.title}</h4>
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <Badge
                  variant="secondary"
                  className={`text-xs ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {task.farm} • {task.assignee}
              </span>
              <span>Due: {task.dueDate}</span>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full bg-transparent">
        View All Tasks
      </Button>
    </div>
  );
}
