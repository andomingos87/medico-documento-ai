import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface Column<T> {
  header: React.ReactNode | string;
  accessor?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'ghost';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  getRowId?: (row: T) => string;
  actions?: RowAction<T>[];
  renderActions?: (row: T) => React.ReactNode;
  className?: string;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'Nenhum registro',
  getRowId,
  actions,
  renderActions,
  className,
  skeletonRows = 5,
  onRowClick,
}: DataTableProps<T>) {
  const colCount = columns.length + (actions || renderActions ? 1 : 0);

  return (
    <div className={['rounded-md border', className].filter(Boolean).join(' ')}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i} className={col.className}>{col.header}</TableHead>
              ))}
              {(actions || renderActions) && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, rIdx) => (
                <TableRow key={`skeleton-${rIdx}`}>
                  {columns.map((_, cIdx) => (
                    <TableCell key={`sk-${rIdx}-${cIdx}`}><Skeleton className="h-4 w-[120px]" /></TableCell>
                  ))}
                  {(actions || renderActions) && (
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="text-center text-sm text-neutral-500 py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => {
                const rowId = getRowId?.(row) ?? (row.id as string | undefined) ?? String(idx);
                return (
                  <TableRow
                    key={rowId}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : undefined}
                  >
                    {columns.map((col, cIdx) => (
                      <TableCell key={`${rowId}-${cIdx}`} className={col.className}>
                        {col.cell ? col.cell(row) : (col.accessor ? String(row[col.accessor] ?? '') : null)}
                      </TableCell>
                    ))}
                    {(actions || renderActions) && (
                      <TableCell>
                        {renderActions ? (
                          renderActions(row)
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              {actions!.map((act, i) => (
                                <DropdownMenuItem
                                  key={i}
                                  className={act.variant === 'destructive' ? 'text-red-600' : undefined}
                                  onClick={() => act.onClick(row)}
                                >
                                  {act.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
