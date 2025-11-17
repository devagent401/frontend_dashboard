import { TrendingUp } from "lucide-react";

export function NeumorphismCard({
    icon: Icon,
    title,
    description,
    value,
    trend,
    className = ""
}: {
    icon: unknown;
    title: string;
    description: string;
    value: string;
    trend?: { value: string; isPositive: boolean };
    className?: string;
}) {
    return (
        <div className={`bg-gray-100 rounded-3xl p-6 shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] transition-all duration-300 group ${className}`}>
            {/* Icon container */}
            <div className="w-16 h-16 bg-gray-100 rounded-2xl shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center mb-6 group-hover:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] transition-all duration-300">
                {Icon as React.ReactNode}
            </div>

            {/* Content */}
            <div className="space-y-3">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
                    <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
                    <p className="text-gray-500 text-sm">{description}</p>
                </div>

                {trend && (
                    <div className="flex items-center gap-2 pt-2">
                        <TrendingUp className={`w-4 h-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                        <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.value}
                        </span>
                        <span className="text-gray-400 text-sm">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
}

