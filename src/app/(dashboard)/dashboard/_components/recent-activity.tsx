import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function RecentActivity() {
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
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
            <AvatarFallback>
              {activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{activity.user}</p>
              <Badge
                variant="secondary"
                className={`text-xs ${getActivityColor(activity.type)}`}
              >
                {activity.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {activity.action}{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
