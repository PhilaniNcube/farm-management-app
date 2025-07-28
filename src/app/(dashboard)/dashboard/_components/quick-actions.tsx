import { Button } from "@/components/ui/button";
import {
  Calendar,
  DollarSign,
  Sprout,
  Users,
  MilkIcon as Cow,
  FileText,
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Add New Crop",
      description: "Plant new crops in your fields",
      icon: Sprout,
      color: "bg-green-50 hover:bg-green-100 text-green-700",
    },
    {
      title: "Record Transaction",
      description: "Log income or expenses",
      icon: DollarSign,
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700",
    },
    {
      title: "Create Task",
      description: "Assign work to your team",
      icon: Calendar,
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700",
    },
    {
      title: "Add Livestock",
      description: "Register new animals",
      icon: Cow,
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700",
    },
    {
      title: "Manage Labor",
      description: "Add or update workers",
      icon: Users,
      color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700",
    },
    {
      title: "Generate Report",
      description: "Create financial reports",
      icon: FileText,
      color: "bg-gray-50 hover:bg-gray-100 text-gray-700",
    },
  ];

  return (
    <div className="grid gap-3">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="ghost"
          className={`h-auto p-4 justify-start ${action.color}`}
        >
          <action.icon className="mr-3 h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">{action.title}</div>
            <div className="text-xs opacity-70">{action.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
}
