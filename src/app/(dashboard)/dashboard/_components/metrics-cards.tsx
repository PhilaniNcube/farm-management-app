import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaginatedQuery, useQuery } from "convex/react";
import {
  DollarSign,
  MapPin,
  Sprout,
  Users,
  MilkIcon as Cow,
  Calendar,
  Users2Icon,
} from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { IconMoneybagMinus } from "@tabler/icons-react";

export function MetricsCards({ organizationId }: { organizationId: string }) {
  const metricsData = useQuery(api.metrics.getMetrics, { organizationId });

  const revenue = metricsData?.transactions.filter(
    (transaction) => transaction.type === "revenue"
  );

  const expenses = metricsData?.transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalRevenue = revenue?.reduce(
    (acc, transaction) => acc + transaction.totalAmount,
    0
  );

  const totalExpenses = expenses?.reduce(
    (acc, transaction) => acc + transaction.totalAmount,
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
          <Sprout className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metricsData?.activeCrops.length}
          </div>
          {/* <p className="text-xs text-muted-foreground">{metric.change}</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Livestock</CardTitle>
          <Cow className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metricsData?.livestockCount.length}
          </div>
          {/* <p className="text-xs text-muted-foreground">{metric.change}</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metricsData?.pendingTasks.length}
          </div>
          {/* <p className="text-xs text-muted-foreground">{metric.change}</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Labour</CardTitle>
          <Users2Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metricsData?.labor.length}</div>
          {/* <p className="text-xs text-muted-foreground">{metric.change}</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRevenue}</div>
          <p className="text-xs text-muted-foreground">in the last 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <IconMoneybagMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalExpenses}</div>
          <p className="text-xs text-muted-foreground">in the last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
