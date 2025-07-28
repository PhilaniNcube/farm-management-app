import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Sprout } from "lucide-react";

export function CropsStatus() {
  const crops = [
    {
      id: 1,
      name: "Winter Wheat",
      variety: "Hard Red Winter",
      farm: "North Field A",
      plantingDate: "2023-10-15",
      harvestDate: "2024-07-20",
      areaPlanted: 25.5,
      status: "growing",
      progress: 65,
    },
    {
      id: 2,
      name: "Corn",
      variety: "Sweet Corn",
      farm: "South Field B",
      plantingDate: "2024-04-10",
      harvestDate: "2024-09-15",
      areaPlanted: 18.2,
      status: "planted",
      progress: 25,
    },
    {
      id: 3,
      name: "Soybeans",
      variety: "Roundup Ready",
      farm: "East Field C",
      plantingDate: "2024-05-01",
      harvestDate: "2024-10-30",
      areaPlanted: 32.1,
      status: "growing",
      progress: 45,
    },
    {
      id: 4,
      name: "Tomatoes",
      variety: "Roma",
      farm: "Greenhouse 1",
      plantingDate: "2024-03-15",
      harvestDate: "2024-08-01",
      areaPlanted: 2.5,
      status: "ready",
      progress: 95,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planted":
        return "bg-blue-100 text-blue-800";
      case "growing":
        return "bg-green-100 text-green-800";
      case "ready":
        return "bg-yellow-100 text-yellow-800";
      case "harvested":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {crops.map((crop) => (
        <Card key={crop.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{crop.name}</CardTitle>
              <Badge className={getStatusColor(crop.status)}>
                {crop.status}
              </Badge>
            </div>
            <CardDescription>{crop.variety}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{crop.farm}</span>
              <span>•</span>
              <span>{crop.areaPlanted} acres</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Growth Progress</span>
                <span>{crop.progress}%</span>
              </div>
              <Progress value={crop.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Planted</p>
                  <p className="font-medium">
                    {new Date(crop.plantingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sprout className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Harvest</p>
                  <p className="font-medium">
                    {new Date(crop.harvestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
