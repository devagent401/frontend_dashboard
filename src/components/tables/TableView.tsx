// import React from 'react'
// import { Card } from '../cards/card';
// import { CardContent } from '../cards/card';
// import { cn } from '@/lib/utils';
// import { Button } from '../button';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropdown-menus/dropdown-menu';
// import { MoreHorizontal } from 'lucide-react';
// import { ExpandIcon } from 'lucide-react';

// type TTableViewProps<T = unknown> = {
//     loading: boolean;
//     currentViewMode: string;
//     paginatedData: T[];
//     selectedItems: (string | number)[];
//     expandedRows: (string | number)[];
//     checkbox: {
//         enabled: boolean;
//         disabled?: (item: T) => boolean;
//     };
//     columns: Array<{
//         key: string;
//         header: string;
//         desktop?: boolean;
//         align?: "left" | "center" | "right";
//         width?: string;
//         sortable?: boolean;
//     }>;
//     actions: Array<{
//         key: string;
//         label: string;
//         icon?: React.ReactNode;
//         onClick: (item: T) => void;
//         variant?: "default" | "destructive" | "secondary";
//         disabled?: (item: T) => boolean;
//     }>;
//     emptyMessage: string;
//     onRowClick: (item: T) => void;
//     handleSelectItem: (item: T) => void;
//     handleRowExpand: (item: T) => void;
//     renderCell: (item: T, column: { key: string; header: string; desktop?: boolean; align?: "left" | "center" | "right"; width?: string; sortable?: boolean }) => React.ReactNode;
//     expandable: {
//         render: (item: T) => React.ReactNode;
//     };
//     sorting: {
//         enabled: boolean;
//     };
//     handleSelectAll: () => void;
//     rowKey: (item: T) => string | number;
//     rowClassName: (item: T) => string;
//     handleSort: (key: string) => void;
//     renderSortIcon: (key: string) => React.ReactNode;
// }

// export default function TableView<T = unknown>({
//     loading,
//     currentViewMode,
//     paginatedData,
//     selectedItems,
//     expandedRows,
//     checkbox,
//     columns,
//     actions,
//     emptyMessage,
//     onRowClick,
//     handleSelectItem,
//     handleRowExpand,
//     renderCell,
//     expandable,
//     sorting,
//     handleSelectAll,
//     rowKey,
//     rowClassName,
//     handleSort,
//     renderSortIcon,
// }: TTableViewProps<T>) {
//     return (
//         <div>  {/* Table View */}
//             {!loading && currentViewMode === "table" && (
//                 <Card>
//                     <CardContent className="p-0">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="border-b bg-muted/50">
//                                         {/* Checkbox column */}
//                                         {checkbox?.enabled && (
//                                             <th className="w-12 p-4">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
//                                                     onChange={handleSelectAll}
//                                                     className="rounded border-gray-300"
//                                                 />
//                                             </th>
//                                         )}

//                                         {/* Expand column */}
//                                         {expandable && (
//                                             <th className="w-12 p-4"></th>
//                                         )}

//                                         {/* Data columns */}
//                                         {columns
//                                             .filter(col => col.desktop !== false)
//                                             .map((column) => (
//                                                 <th
//                                                     key={column.key}
//                                                     className={cn(
//                                                         "text-left p-4 font-medium",
//                                                         column.align === "center" && "text-center",
//                                                         column.align === "right" && "text-right",
//                                                         column.width && `w-${column.width}`,
//                                                         column.sortable && sorting?.enabled && "cursor-pointer select-none"
//                                                     )}
//                                                     onClick={() => column.sortable && sorting?.enabled && handleSort(column.key)}
//                                                 >
//                                                     <div className="flex items-center gap-2">
//                                                         {column.header}
//                                                         {column.sortable && sorting?.enabled && renderSortIcon(column.key)}
//                                                     </div>
//                                                 </th>
//                                             ))}
//                                         {actions.length > 0 && (
//                                             <th className="text-right p-4 font-medium w-12">Actions</th>
//                                         )}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {paginatedData.length > 0 ? (
//                                         paginatedData.map((item) => {
//                                             const itemKey = rowKey(item);
//                                             const isExpanded = expandedRows.includes(itemKey);
//                                             const isSelected = selectedItems.includes(itemKey);

//                                             return (
//                                                 <React.Fragment key={itemKey}>
//                                                     <tr
//                                                         className={cn(
//                                                             "border-b hover:bg-muted/25 transition-colors",
//                                                             typeof onRowClick === "function" && "cursor-pointer",
//                                                             isSelected && "bg-muted/50",
//                                                             rowClassName?.(item)
//                                                         )}
//                                                         onClick={() => onRowClick?.(item)}
//                                                     >
//                                                         {/* Checkbox column */}
//                                                         {checkbox?.enabled && (
//                                                             <td className="w-12 p-4">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     checked={isSelected}
//                                                                     onChange={() => handleSelectItem(item)}
//                                                                     disabled={checkbox.disabled?.(item)}
//                                                                     className="rounded border-gray-300"
//                                                                 />
//                                                             </td>
//                                                         )}

//                                                         {/* Expand column */}
//                                                         {expandable && (
//                                                             <td className="w-12 p-4">
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="sm"
//                                                                     onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
//                                                                         e.stopPropagation();
//                                                                         handleRowExpand(item);
//                                                                     }}
//                                                                     className="h-6 w-6 p-0"
//                                                                 >
//                                                                     <ExpandIcon
//                                                                         className={cn(
//                                                                             "h-4 w-4 transition-transform",
//                                                                             isExpanded && "rotate-90"
//                                                                         )}
//                                                                     />
//                                                                 </Button>
//                                                             </td>
//                                                         )}

//                                                         {/* Data columns */}
//                                                         {columns
//                                                             .filter(col => col.desktop !== false)
//                                                             .map((column) => (
//                                                                 <td
//                                                                     key={column.key}
//                                                                     className={cn(
//                                                                         "p-4",
//                                                                         column.align === "center" && "text-center",
//                                                                         column.align === "right" && "text-right"
//                                                                     )}
//                                                                 >
//                                                                     {renderCell(item, column)}
//                                                                 </td>
//                                                             ))}
//                                                         {actions.length > 0 && (
//                                                             <td className="p-4 text-right">
//                                                                 <DropdownMenu>
//                                                                     <DropdownMenuTrigger asChild>
//                                                                         <Button
//                                                                             variant="ghost"
//                                                                             className="h-8 w-8 p-0"
//                                                                             onClick={(e) => e.stopPropagation()}
//                                                                         >
//                                                                             <MoreHorizontal className="h-4 w-4" />
//                                                                         </Button>
//                                                                     </DropdownMenuTrigger>
//                                                                     <DropdownMenuContent align="end">
//                                                                         {actions.map((action) => (
//                                                                             <DropdownMenuItem
//                                                                                 key={action.key}
//                                                                                 onClick={(e: React.MouseEvent<HTMLDivElement>) => {
//                                                                                     e.stopPropagation();
//                                                                                     action.onClick(item);
//                                                                                 }}
//                                                                                 disabled={action.disabled?.(item)}
//                                                                                 className={cn(
//                                                                                     action.variant === "destructive" && "text-red-600"
//                                                                                 )}
//                                                                             >
//                                                                                 {action.icon}
//                                                                                 {action.label}
//                                                                             </DropdownMenuItem>
//                                                                         ))}
//                                                                     </DropdownMenuContent>
//                                                                 </DropdownMenu>
//                                                             </td>
//                                                         )}
//                                                     </tr>

//                                                     {/* Expanded row content */}
//                                                     {expandable && isExpanded && (
//                                                         <tr>
//                                                             <td
//                                                                 colSpan={
//                                                                     columns.filter(col => col.desktop !== false).length +
//                                                                     (checkbox?.enabled ? 1 : 0) +
//                                                                     (expandable ? 1 : 0) +
//                                                                     (actions.length > 0 ? 1 : 0)
//                                                                 }
//                                                                 className="p-0"
//                                                             >
//                                                                 <div className="bg-muted/25 p-4 border-b">
//                                                                     {expandable.render(item)}
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )}
//                                                 </React.Fragment>
//                                             );
//                                         })
//                                     ) : (
//                                         <tr>
//                                             <td
//                                                 colSpan={
//                                                     columns.filter(col => col.desktop !== false).length +
//                                                     (checkbox?.enabled ? 1 : 0) +
//                                                     (expandable ? 1 : 0) +
//                                                     (actions.length > 0 ? 1 : 0)
//                                                 }
//                                                 className="h-24 text-center text-muted-foreground"
//                                             >
//                                                 {emptyMessage}
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}</div>
//     )
// }
