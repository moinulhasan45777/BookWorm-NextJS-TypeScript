import { DataTable } from "@/components/data-table";
import data from "./data.json";
import React from "react";

export default function page() {
  return (
    <div>
      <DataTable data={data} />
    </div>
  );
}
