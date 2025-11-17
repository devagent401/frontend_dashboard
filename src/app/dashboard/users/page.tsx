import { Users, UserPlus, Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function UsersPage() {
    const mockUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", joinDate: "2024-01-15" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", joinDate: "2024-01-20" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive", joinDate: "2024-01-10" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Moderator", status: "Active", joinDate: "2024-01-25" },
        { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "User", status: "Active", joinDate: "2024-02-01" }
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-[var(--color-surface)] rounded-lg p-6 border border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                            User Management
                        </h1>
                        <p className="text-[var(--color-textSecondary)]">
                            Manage and monitor all users in your system
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                        <Button>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-textSecondary)]" />
                        <Input
                            placeholder="Search users by name, email, or role..."
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
                    <div className="flex items-center">
                        <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                            <Users className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-[var(--color-textSecondary)]">Total Users</p>
                            <p className="text-xl font-bold text-[var(--color-text)]">{mockUsers.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[var(--color-background)]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Join Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-textSecondary)] uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-[var(--color-background)]">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-[var(--color-primary)]">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[var(--color-text)]">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-[var(--color-textSecondary)]">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'Moderator' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active'
                                                ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                                                : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-textSecondary)]">
                                        {new Date(user.joinDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-[var(--color-textSecondary)] hover:text-[var(--color-text)]">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-[var(--color-textSecondary)]">
                    Showing 1 to {mockUsers.length} of {mockUsers.length} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-[var(--color-primary)] text-white">
                        1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
