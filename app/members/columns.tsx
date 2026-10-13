"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./data-table-features"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = {
  id: string
  fullname: string
  email: string
  reg_date: string
  transactions: number
  total_earned_points: number
  active_points: number
}

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Member>()

export const columns = columnHelper.columns([
  columnHelper.accessor("fullname", {
    header: "Fullname",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
  columnHelper.accessor("reg_date", {
    header: "Registration date",
  }),
  columnHelper.accessor("transactions", {
    header: "transactions",
  }),
  columnHelper.accessor("total_earned_points", {
    header: "Total earned Points",
  }),
  columnHelper.accessor("active_points", {
    header: "Active Points",
  }),
])