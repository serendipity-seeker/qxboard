import { Order } from "@/types";
import clsx from "clsx";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { formatQubicAmount } from "@/utils";
import { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface OrderTableProps extends React.HTMLAttributes<HTMLDivElement> {
  orders: Order[];
  type: "ask" | "bid";
  id: string;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, type, id, className, ...props }) => {
  const columnHelper = createColumnHelper<Order>();
  const columns = [
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <div className={clsx("text-right font-semibold", type === "ask" ? "text-red-500" : "text-green-500")}>
          {formatQubicAmount(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor("numberOfShares", {
      header: "Quantity",
      cell: (info) => <div className="text-right">{info.getValue().toLocaleString()}</div>,
    }),
    columnHelper.accessor((row) => row.price * row.numberOfShares, {
      id: "total",
      header: "Total",
      cell: (info) => <div className="text-right">{formatQubicAmount(info.getValue())}</div>,
    }),
  ];

  const displayData = useMemo(() => {
    const sortedData = [...orders].sort((a, b) => {
      if (type === "ask") {
        return a.price - b.price;
      }
      return b.price - a.price;
    });
    return sortedData;
  }, [orders, type]);

  const totalVolume = useMemo(() => {
    return orders.reduce((acc, order) => acc + order.price * order.numberOfShares, 0);
  }, [orders]);

  const table = useReactTable({
    data: displayData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      if (type === "ask") {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      } else if (type === "bid") {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [type, displayData]);

  return (
    <div className={clsx("w-full rounded-lg p-3 text-sm shadow-md", className)} {...props}>
      <div className={clsx("flex w-full border-b px-2 py-1 font-medium", type === "bid" && "hidden")}>
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div key={header.id} className="flex-1 text-center">
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          )),
        )}
      </div>

      <motion.div
        ref={containerRef}
        className={clsx("flex h-[300px] w-full flex-1 flex-col overflow-y-auto", type === "ask" && "flex-col-reverse")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {table.getRowModel().rows.map((row) => {
          const rowVolume = row.original.price * row.original.numberOfShares;
          const bgWidth = (rowVolume / totalVolume) * 300; // Dominant of 30% of total volume
          return (
            <motion.div
              key={row.id}
              className={
                "flex w-full px-2 py-1 text-xs transition-colors duration-150 hover:cursor-pointer hover:bg-gray-40"
              }
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: row.index * 0.02 }}
              style={{
                background: `linear-gradient(to left, ${type === "ask" ? "rgba(255, 0, 0, 0.1)" : "rgba(0, 255, 0, 0.1)"} ${bgWidth}%, transparent ${bgWidth}%)`,
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="flex-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default OrderTable;
