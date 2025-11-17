
// import { cn } from '@/lib/utils';
// import { MoreHorizontal } from 'lucide-react';
// import { ExpandIcon } from 'lucide-react';
// import React from 'react';
// import { Card, CardContent } from '../cards/card';
// import { Button } from '../button';


// type TCardViewProps<T = unknown> = {
//     loading: boolean;
//     currentViewMode: string;
//     paginatedData: T[];
//     selectedItems: (string | number)[];
//     expandedRows: (string | number)[];
//     rowKey: (item: T) => string | number;
//     checkbox: {
//         enabled: boolean;
//         disabled?: (item: T) => boolean;
//     };
//     columns: Array<{
//         key: string;
//         header: string;
//         mobile?: boolean;
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
//     renderCell: (item: T, column: { key: string; header: string; mobile?: boolean }) => React.ReactNode;
//     expandable: {
//         render: (item: T) => React.ReactNode;
//     };
// }

// export default function CardView<T = unknown>({
//     loading,
//     currentViewMode,
//     paginatedData,
//     selectedItems,
//     expandedRows,
//     rowKey,
//     checkbox,
//     columns,
//     actions,
//     emptyMessage,
//     onRowClick,
//     handleSelectItem,
//     handleRowExpand,
//     renderCell,
//     expandable,
// }: TCardViewProps<T>) {
//     return (
//         <div>
//             {!loading && currentViewMode === "cards" && (
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                     {paginatedData.length > 0 ? (
//                         paginatedData.map((item) => {
//                             const itemKey = rowKey(item);
//                             const isSelected = selectedItems.includes(itemKey);
//                             const isExpanded = expandedRows.includes(itemKey);

//                             return (
//                                 <Card
//                                     key={itemKey}
//                                     className={cn(
//                                         "relative",
//                                         typeof onRowClick === "function" && "cursor-pointer hover:shadow-md transition-shadow",
//                                         isSelected && "ring-2 ring-primary"
//                                     )}
//                                     onClick={() => onRowClick?.(item)}
//                                 >
//                                     {/* Checkbox */}
//                                     {checkbox?.enabled && (
//                                         <div className="absolute top-2 right-2">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={isSelected}
//                                                 onChange={() => handleSelectItem(item)}
//                                                 disabled={checkbox.disabled?.(item)}
//                                                 className="rounded border-gray-300"
//                                                 onClick={(e) => e.stopPropagation()}
//                                             />
//                                         </div>
//                                     )}

//                                     <CardContent className="p-4">
//                                         <div className="space-y-3">
//                                             {columns
//                                                 .filter(col => col.mobile !== false)
//                                                 .map((column) => (
//                                                     <div key={column.key} className="flex justify-between items-center">
//                                                         <span className="text-sm font-medium text-muted-foreground">
//                                                             {column.header}:
//                                                         </span>
//                                                         <span className="text-sm">
//                                                             {renderCell(item, column)}
//                                                         </span>
//                                                     </div>
//                                                 ))}

//                                             {/* Expand button */}
//                                             {expandable && (
//                                                 <div className="pt-2 border-t">
//                                                     <Button
//                                                         variant="ghost"
//                                                         size="sm"
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleRowExpand(item);
//                                                         }}
//                                                         className="w-full justify-between"
//                                                     >
//                                                         <span>Details</span>
//                                                         <ExpandIcon
//                                                             className={cn(
//                                                                 "h-4 w-4 transition-transform",
//                                                                 isExpanded && "rotate-90"
//                                                             )}
//                                                         />
//                                                     </Button>
//                                                 </div>
//                                             )}

//                                             {/* Expanded content */}
//                                             {expandable && isExpanded && (
//                                                 <div className="pt-3 border-t bg-muted/25 -mx-4 px-4 -mb-4 pb-4">
//                                                     {expandable.render(item)}
//                                                 </div>
//                                             )}

//                                             {actions.length > 0 && (
//                                                 <div className="pt-3 border-t">
//                                                     <DropdownMenu>
//                                                         <DropdownMenuTrigger asChild>
//                                                             <Button
//                                                                 variant="ghost"
//                                                                 size="sm"
//                                                                 className="w-full"
//                                                                 onClick={(e) => e.stopPropagation()}
//                                                             >
//                                                                 <MoreHorizontal className="h-4 w-4 mr-2" />
//                                                                 Actions
//                                                             </Button>
//                                                         </DropdownMenuTrigger>
//                                                         <DropdownMenuContent align="end">
//                                                             {actions.map((action) => (
//                                                                 <DropdownMenuItem
//                                                                     key={action.key}
//                                                                     onClick={(e: React.MouseEvent<HTMLDivElement>) => {
//                                                                         e.stopPropagation();
//                                                                         action.onClick(item);
//                                                                     }}
//                                                                     disabled={action.disabled?.(item)}
//                                                                     className={cn(
//                                                                         action.variant === "destructive" && "text-red-600"
//                                                                     )}
//                                                                 >
//                                                                     {action.icon}
//                                                                     {action.label}
//                                                                 </DropdownMenuItem>
//                                                             ))}
//                                                         </DropdownMenuContent>
//                                                     </DropdownMenu>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//                             );
//                         })
//                     ) : (
//                         <div className="col-span-full text-center py-12 text-muted-foreground">
//                             {emptyMessage}
//                         </div>
//                     )}
//                 </div>
//             )}

//         </div>
//     )
// }
