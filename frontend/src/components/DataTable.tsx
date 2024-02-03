import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React from 'react'
import { DataTablePagination } from './DataTablePagination'
import { useSearchParams } from 'react-router-dom'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [searchParams, setSeachParams] = useSearchParams()

  const pageSize = searchParams.get('per_page')
    ? Number(searchParams.get('per_page'))
    : 10
  const maxPage = Math.ceil(data.length / pageSize)

  const onPageChange = (pageNumber: number) => {
    setSeachParams((prevParams) => {
      const currentPage = Number(prevParams.get('page')) || 1
      const newPage = currentPage + pageNumber

      if (newPage >= 1 && newPage <= Math.ceil(data.length / pageSize)) {
        const newParams = new URLSearchParams(prevParams)
        newParams.set('page', newPage.toString())
        return newParams
      }

      // If the new page is out of bounds, return the original params
      return prevParams
    })
  }
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil(data.length / pageSize),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageIndex: searchParams.get('page')
          ? Number(searchParams.get('page')) - 1
          : 0,
        pageSize,
      },
    },
  })

  return (
    <div className="rounded-md border min-h-96 flex flex-col justify-between">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="py-4 border-t border-background-foreground">
        <DataTablePagination
          table={table}
          onPageChange={onPageChange}
          maxPage={maxPage}
        />
      </div>
    </div>
  )
}
