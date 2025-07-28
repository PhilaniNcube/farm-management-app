import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrganization } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, Calendar, CheckCircle2, Clock } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { format } from "date-fns/format";
import { differenceInDays } from "date-fns/differenceInDays";

export function TasksOverview() {
  const organization = useOrganization();

  const recentTasks = useQuery(api.tasks.getTasksByOrganization, {
    organizationId: organization.organization?.id || "",
  });

  const completeTask = useMutation(api.tasks.updateTaskStatus);

  function getStatusIcon(status: string) {
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
  }

  return (
    <div className="space-y-4">
      {recentTasks?.map((task) => (
        <div
          key={task._id}
          className="flex items-center space-x-4 p-3 border rounded-lg"
        >
          {/* This checkbox should trigger task completion */}
          <Checkbox
            checked={task.status === "completed"}
            onCheckedChange={(checked) => {
              // Call API to update task status
              completeTask({
                taskId: task._id,
                status: checked ? "completed" : "pending",
              });
            }}
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{task.title}</h4>
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <Badge variant="secondary" className={`text-xs `}>
                  {task.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{task.description}</span>
              {/* Show how many days left until due date */}
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {differenceInDays(task.dueDate, new Date()) > 1
                    ? `${differenceInDays(task.dueDate, new Date())} days left`
                    : differenceInDays(task.dueDate, new Date()) === 1
                      ? "1 day left"
                      : "Due today"}
                </span>
              </span>
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
