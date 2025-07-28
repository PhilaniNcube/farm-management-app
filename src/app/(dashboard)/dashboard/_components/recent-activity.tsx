import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { format } from "date-fns";

export function RecentActivity() {
  const organization = useOrganization();

  const recentTasks = useQuery(api.tasks.getPendingTasks, {
    organizationId: organization.organization?.id || "",
  });

  const activities = [
    {
      user: "John Smith",
      action: "completed harvest",
      target: "Corn Field A",
      time: "2 hours ago",
      type: "harvest",
    },
    {
      user: "Sarah Johnson",
      action: "added new livestock",
      target: "5 Holstein Cows",
      time: "4 hours ago",
      type: "livestock",
    },
    {
      user: "Mike Wilson",
      action: "updated task",
      target: "Irrigation System Check",
      time: "6 hours ago",
      type: "task",
    },
    {
      user: "Emily Davis",
      action: "recorded transaction",
      target: "$2,500 Equipment Purchase",
      time: "1 day ago",
      type: "transaction",
    },
    {
      user: "Tom Brown",
      action: "planted crops",
      target: "Wheat Field B",
      time: "2 days ago",
      type: "planting",
    },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "harvest":
        return "bg-green-100 text-green-800";
      case "livestock":
        return "bg-blue-100 text-blue-800";
      case "task":
        return "bg-yellow-100 text-yellow-800";
      case "transaction":
        return "bg-purple-100 text-purple-800";
      case "planting":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {recentTasks?.map((activity, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{activity.title}</p>
              <Badge
                variant="secondary"
                className={`text-xs capitalize ${getActivityColor(activity.status)}`}
              >
                {activity.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {activity.description}{" "}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Due Date:</strong> {format(activity.dueDate, "PPP")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
