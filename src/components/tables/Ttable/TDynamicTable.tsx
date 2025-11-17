// Types for the dynamic table
export interface TableColumn<T> {
    key: string;
    header: string;
    accessor: (item: T) => unknown;
    sortable?: boolean;
    searchable?: boolean;
    width?: string;
    align?: "left" | "center" | "right";
    render?: (value: unknown, item: T) => React.ReactNode;
    mobile?: boolean; // Show on mobile
    desktop?: boolean; // Show on desktop
    sortKey?: string; // Custom sort key for API sorting
}

export interface TableAction<T> {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    variant?: "default" | "destructive" | "secondary";
    disabled?: (item: T) => boolean;
}

export interface TableFilter {
    key: string;
    label: string;
    type: "select" | "date" | "text" | "number";
    options?: { value: string; label: string }[];
    placeholder?: string;
}

export interface ExpandableRow<T> {
    key: string;
    render: (item: T) => React.ReactNode;
    expanded?: boolean; // Default expanded state
}

export interface CheckboxConfig<T> {
    enabled: boolean;
    returnFullObject?: boolean; // true = return full object, false = return id only
    onSelectionChange?: (selected: T[] | (string | number)[]) => void;
    disabled?: (item: T) => boolean;
}

export interface SortingConfig {
    enabled: boolean;
    mode: "client" | "server" | "hybrid"; // client = local sorting, server = API sorting, hybrid = both
    serverSorting?: {
        onSort: (sortKey: string, direction: "asc" | "desc") => Promise<void>;
        loading?: boolean;
    };
    defaultSort?: {
        key: string;
        direction: "asc" | "desc";
    };
}

export interface DynamicTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    actions?: TableAction<T>[];
    filters?: TableFilter[];
    searchPlaceholder?: string;
    searchKeys?: string[];
    title?: string;
    description?: string;
    className?: string;
    showStats?: boolean;
    statsConfig?: {
        totalLabel?: string;
        customStats?: Array<{
            key: string;
            label: string;
            value: (data: T[]) => number | string;
            icon?: React.ReactNode;
            variant?: "default" | "secondary" | "destructive";
        }>;
    };
    viewMode?: "table" | "cards" | "both";
    defaultViewMode?: "table" | "cards";
    pagination?: {
        enabled?: boolean;
        pageSize?: number;
        pageSizeOptions?: number[];
    };
    loading?: boolean;
    emptyMessage?: string;
    onRefresh?: () => void;
    onExport?: () => void;
    responsive?: boolean;
    selectable?: boolean;
    onSelectionChange?: (selectedItems: T[]) => void;
    rowKey?: (item: T) => string | number;
    // New props for enhanced functionality
    checkbox?: CheckboxConfig<T>;
    expandable?: ExpandableRow<T>;
    sorting?: SortingConfig;
    onRowClick?: (item: T) => void;
    rowClassName?: (item: T) => string;
}
