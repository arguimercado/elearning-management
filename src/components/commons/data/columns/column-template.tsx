//@typescript-eslint/no-explicit-any
"use client"

// Generic column helper utilities for the DataTable (TanStack v8)
// These helpers reduce repetition when defining common column patterns

import * as React from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Base config shared by helpers
interface BaseColOptions<TData> {
	accessorKey: keyof TData & string
	header?: string | React.ReactNode
	enableSorting?: boolean
	enableHiding?: boolean
}

// Sortable text column
export function createTextColumn<TData>(opts: BaseColOptions<TData> & {
	className?: string
	render?: (value: any, row: Row<TData>) => React.ReactNode
}): ColumnDef<TData> {
	const { accessorKey, header, enableSorting = true, enableHiding = true, className, render } = opts
	return {
		accessorKey,
		enableSorting,
		enableHiding,
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="px-0 font-medium"
				onClick={() => enableSorting && column.toggleSorting(column.getIsSorted() === "asc")}
				disabled={!enableSorting}
			>
				{header ?? toTitle(accessorKey)}
				{enableSorting && <ArrowUpDown className="ml-2 h-4 w-4" />}
			</Button>
		),
		cell: ({ row, getValue }) => {
			const v = getValue<any>()
			return <div className={className}>{render ? render(v, row) : String(v ?? "")}</div>
		},
	}
}

// Badge column (simple value inside a Badge component)
export function createBadgeColumn<TData>(opts: BaseColOptions<TData> & {
	variant?: React.ComponentProps<typeof Badge>["variant"]
	className?: string
	valueMap?: Record<string, string> // map raw -> display
	colorMap?: Record<string, string> // map raw -> className
}): ColumnDef<TData> {
	const { accessorKey, header, enableSorting = false, enableHiding = true, variant = "secondary", className, valueMap, colorMap } = opts
		const headerNode = header ?? toTitle(accessorKey)
		return {
			accessorKey,
			enableSorting,
			enableHiding,
			header: () => <>{headerNode}</>,
			cell: ({ getValue }) => {
			const raw = String(getValue<any>() ?? "")
			const display = valueMap?.[raw] ?? raw
			const extra = colorMap?.[raw]
			return <Badge variant={variant} className={[className, extra].filter(Boolean).join(" ")}>{display}</Badge>
		},
	}
}
export function createTruncateColumn<TData>(opts: BaseColOptions<TData> & {
	maxLength: number
	ellipsisText?: string
}): ColumnDef<TData> {
	const { accessorKey, header, enableSorting = false, enableHiding = true, maxLength, ellipsisText = "..." } = opts
	return {
		accessorKey,
		enableSorting,
		enableHiding,
		header: () => <>{header ?? toTitle(accessorKey)}</>,
		cell: ({ getValue }) => {
			const raw = String(getValue<any>() ?? "")
			if (raw.length > maxLength) {
				return <span title={raw}>{raw.slice(0, maxLength) + ellipsisText}</span>
			}
			return <span>{raw}</span>
		},
	}
}

// Date column
export function createDateColumn<TData>(opts: BaseColOptions<TData> & {
	formatString?: string
	emptyLabel?: string
}): ColumnDef<TData> {
	const { accessorKey, header, enableSorting = true, enableHiding = true, formatString = "PP", emptyLabel = "-" } = opts
	return {
		accessorKey,
		enableSorting,
		enableHiding,
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="px-0 font-medium"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{header ?? toTitle(accessorKey)}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ getValue }) => {
			const v = getValue<any>()
			if (!v) return emptyLabel
			try {
				const d = typeof v === "string" || typeof v === "number" ? new Date(v) : (v as Date)
				return format(d, formatString)
			} catch {
				return emptyLabel
			}
		},
	}
}

// Currency column
export function createCurrencyColumn<TData>(opts: BaseColOptions<TData> & {
	currency?: string
	locale?: string
	minimumFractionDigits?: number
	maximumFractionDigits?: number
	prefixIcon?: React.ReactNode
}): ColumnDef<TData> {
	const { accessorKey, header, enableSorting = true, enableHiding = true, currency = "USD", locale = "en-US", minimumFractionDigits, maximumFractionDigits, prefixIcon } = opts
	return {
		accessorKey,
		enableSorting,
		enableHiding,
		header: ({ column }) => (
			<Button
				variant="ghost"
				className="px-0 font-medium"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				{header ?? toTitle(accessorKey)}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ getValue }) => {
			const raw = Number(getValue<any>() ?? 0)
			const formatted = new Intl.NumberFormat(locale, {
				style: "currency",
				currency,
				minimumFractionDigits,
				maximumFractionDigits,
			}).format(raw)
			return <div className="flex items-center font-medium gap-1">{prefixIcon}{formatted}</div>
		},
	}
}

// Actions column (non-hideable & non-sortable)
export function createActionsColumn<TData>(opts: {
	id?: string
	cell: (row: Row<TData>) => React.ReactNode
	header?: string | React.ReactNode
}): ColumnDef<TData> {
	const { id = "actions", cell, header } = opts
		return {
			id,
			enableHiding: false,
			enableSorting: false,
			header: header ? () => <>{header}</> : undefined,
			cell: ({ row }) => cell(row),
		}
}

// Utility: convert camelCase / snake_case to Title Case
function toTitle(key: string) {
	return key
		.replace(/[_-]/g, " ")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^\w|\s\w/g, (m) => m.toUpperCase())
}

// Example (delete when not needed):
// const titleCol = createTextColumn<CourseModel>({ accessorKey: "title", header: "Title" })

export const ColumnHelpers = {
	text: createTextColumn,
	badge: createBadgeColumn,
	date: createDateColumn,
	currency: createCurrencyColumn,
	actions: createActionsColumn,
   truncate: createTruncateColumn,
}

export type { ColumnDef }

