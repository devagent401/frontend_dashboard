import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "./card";

// Interactive Stats Card
export function StatsCard({
    title,
    value,
    icon: Icon,
    change,
    data,
    className = ""
}: {
    title: string;
    value: string;
    icon: unknown;
    change: { value: string; isPositive: boolean };
    data: number[];
    className?: string;
}) {
    const maxValue = Math.max(...data);

    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                        {Icon as React.ReactNode}
                    </div>
                </div>

                {/* Mini chart */}
                <div className="flex items-end gap-1 h-12 mb-4">
                    {data.map((point: number, index: number) => (
                        <div
                            key={index}
                            className="flex-1 bg-gradient-to-t from-primary/20 to-primary/60 rounded-sm transition-all duration-300 hover:from-primary/40 hover:to-primary/80"
                            style={{ height: `${(point / maxValue) * 100}%` }}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${change.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                    <span className={`text-sm font-medium ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {change.value}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
            </CardContent>
        </Card>
    );
}