"use client";
import { useQuery } from "convex/react";
import React from "react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Ruler, Plus, ExternalLink } from "lucide-react";
import { format } from "date-fns";

const FarmsOverview = () => {
  const farmsData = useQuery(api.farms.getMyFarms);

  if (farmsData === undefined) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (farmsData === null || farmsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No farms found</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          You don't have access to any farms yet. Create your first farm to get
          started with managing your agricultural operations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Farms</h2>
          <p className="text-muted-foreground">
            Manage and monitor your {farmsData.length} farm
            {farmsData.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmsData.length > 0 &&
          farmsData
            .filter((farm) => farm !== null)
            .map((farm) => (
              <Card
                key={farm._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{farm.name}</span>
                    <Badge variant="secondary">{farm.size} acres</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{farm.location}</span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Created {format(farm.createdAt, "PPp")}</span>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{farm.size} acres total area</span>
                  </div>

                  <div className="pt-2">
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/${farm.organizationId}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Farm
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default FarmsOverview;
