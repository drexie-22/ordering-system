import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: boolean;
}

export function StatsCard({ title, value, icon: Icon, gradient }: StatsCardProps) {
  return (
    <Card
      className={`border-white/10 ${
        gradient
          ? "bg-gradient-to-br from-primary/20 to-chart-2/20 border-primary/30"
          : "bg-card/50"
      } backdrop-blur-sm`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${gradient ? "text-primary" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
