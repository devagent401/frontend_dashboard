import React from 'react'
import { Button } from '../button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    loading: boolean;
    pagination: {
        enabled: boolean;
        pageSizeOptions: number[];
    };
    totalPages: number;
    currentPage: number;
    pageSize: number;
    sortedData: unknown[];
    setPageSize: (size: number) => void;
    setCurrentPage: (page: number) => void;
};
export default function Pagination({
    loading,
    pagination,
    totalPages,
    currentPage,
    pageSize,
    sortedData,
    setPageSize,
    setCurrentPage,
}: PaginationProps) {
    return (
        <>
            {!loading && pagination.enabled && totalPages > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * pageSize) + 1} to{" "}
                        {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
                            >
                                {pagination.pageSizeOptions?.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}