import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  MapPin,
  Sprout,
  Users,
  MilkIcon as Cow,
  Calendar,
} from "lucide-react";

export function MetricsCards() {
  const metrics = [
    {
      title: "Total Farms",
      value: "12",
      change: "+2 from last month",
      icon: MapPin,
      trend: "up",
    },
    {
      title: "Active Crops",
      value: "48",
      change: "+12% from last season",
      icon: Sprout,
      trend: "up",
    },
    {
      title: "Monthly Revenue",
      value: "$24,500",
      change: "+8% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Livestock Count",
      value: "156",
      change: "+4 this week",
      icon: Cow,
      trend: "up",
    },
    {
      title: "Pending Tasks",
      value: "23",
      change: "5 due today",
      icon: Calendar,
      trend: "neutral",
    },
    {
      title: "Labor Force",
      value: "18",
      change: "2 new hires",
      icon: Users,
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
