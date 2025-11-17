import { BarChart3, TrendingUp, Users, DollarSign, Activity, Target } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                            Analytics Dashboard
                        </h1>
                        <p className="text-[var(--color-textSecondary)]">
                            Comprehensive analytics and insights for your business
                        </p>
                    </div>
                    <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg">
                        <BarChart3 className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-textSecondary)]">Total Revenue</p>
                            <p className="text-3xl font-bold text-[var(--color-text)]">$45,231</p>
                            <p className="text-sm text-[var(--color-success)] flex items-center mt-1">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +12.5% from last month
                            </p>
                        </div>
                        <div className="p-3 bg-[var(--color-success)]/10 rounded-lg">
                            <DollarSign className="w-6 h-6 text-[var(--color-success)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-textSecondary)]">Active Users</p>
                            <p className="text-3xl font-bold text-[var(--color-text)]">2,350</p>
                            <p className="text-sm text-[var(--color-success)] flex items-center mt-1">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +8.2% from last month
                            </p>
                        </div>
                        <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg">
                            <Users className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-textSecondary)]">Conversion Rate</p>
                            <p className="text-3xl font-bold text-[var(--color-text)]">3.24%</p>
                            <p className="text-sm text-[var(--color-warning)] flex items-center mt-1">
                                <Activity className="w-4 h-4 mr-1" />
                                -2.1% from last month
                            </p>
                        </div>
                        <div className="p-3 bg-[var(--color-warning)]/10 rounded-lg">
                            <Target className="w-6 h-6 text-[var(--color-warning)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-textSecondary)]">Page Views</p>
                            <p className="text-3xl font-bold text-[var(--color-text)]">12,543</p>
                            <p className="text-sm text-[var(--color-success)] flex items-center mt-1">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +15.3% from last month
                            </p>
                        </div>
                        <div className="p-3 bg-[var(--color-info)]/10 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-[var(--color-info)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Revenue Trend</h2>
                    <div className="h-64 flex items-center justify-center bg-[var(--color-background)] rounded-lg">
                        <div className="text-center">
                            <BarChart3 className="w-12 h-12 text-[var(--color-textSecondary)] mx-auto mb-2" />
                            <p className="text-[var(--color-textSecondary)]">Chart visualization would go here</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                    <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">User Activity</h2>
                    <div className="h-64 flex items-center justify-center bg-[var(--color-background)] rounded-lg">
                        <div className="text-center">
                            <Activity className="w-12 h-12 text-[var(--color-textSecondary)] mx-auto mb-2" />
                            <p className="text-[var(--color-textSecondary)]">Activity chart would go here</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[
                        { action: "New user registration", time: "2 minutes ago", type: "success" },
                        { action: "Payment processed", time: "5 minutes ago", type: "info" },
                        { action: "System backup completed", time: "1 hour ago", type: "success" },
                        { action: "Failed login attempt", time: "2 hours ago", type: "warning" },
                        { action: "Database optimization", time: "3 hours ago", type: "info" }
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[var(--color-background)] rounded-lg">
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-3 ${activity.type === 'success' ? 'bg-[var(--color-success)]' :
                                        activity.type === 'warning' ? 'bg-[var(--color-warning)]' :
                                            'bg-[var(--color-info)]'
                                    }`} />
                                <span className="text-[var(--color-text)]">{activity.action}</span>
                            </div>
                            <span className="text-sm text-[var(--color-textSecondary)]">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
