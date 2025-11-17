'use client';
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../button";
import { Card, CardContent, CardHeader } from "./card";

export function ProgressCard({
    title,
    description,
    progress,
    icon: Icon,
    color = "blue",
    className = ""
}: {
    title: string;
    description: string;
    progress: number;
    icon: unknown;
    color?: "blue" | "green" | "purple" | "orange";
    className?: string;
}) {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedProgress(progress);
        }, 100);
        return () => clearTimeout(timer);
    }, [progress]);

    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        orange: "from-orange-500 to-orange-600"
    };

    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
                        {Icon as React.ReactNode}
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{progress}%</div>
                        <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                {/* Animated progress bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-1000 ease-out`}
                            style={{ width: `${animatedProgress}%` }}
                        />
                    </div>
                </div>

                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}