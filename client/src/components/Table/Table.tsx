import React from "react";
import { Spinner } from "components/Spinner";

export interface TableData<T> {
  headerCells: (string | React.ReactNode)[];
  rows: { [Key in keyof T]: T[Key] | React.ReactNode }[];
  columnsWidth?: number[];
}

interface TableProps<T> {
  tableData: TableData<T>;
  isLoading: boolean;
}

type TableComponent<T = any> = React.FC<TableProps<T>>;

export const Table: TableComponent = ({ tableData, isLoading = false }) => {
  return (
    tableData && (
      <div className="flex flex-col rounded-lg overflow-auto">
        <table className="table-auto font-white text-white bg-slate-900 border-none rounded-lg w-full overflow-auto border-collapse">
          <thead>
            <tr>
              {tableData.headerCells.map((column, index) => (
                <th
                  key={index}
                  className="border px-[20px] py-[10px] border-none text-start sticky top-0 z-1 bg-slate-900"
                  style={{"width": `${tableData.columnsWidth && tableData.columnsWidth[index]}%`}}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-800">
            {isLoading ? (
              <tr>
                <td
                  className="text-center h-[50px] text-al"
                  colSpan={tableData.headerCells.length}
                >
                  <div className="m-auto size-8">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : tableData.rows.length ? (
              tableData.rows.map((row, index) => (
                <tr key={index} className="even:bg-slate-900">
                  {Object.keys(row).map((key, index) => (
                    <td
                      key={index}
                      className="border px-[20px] py-[10px] border-none"
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="text-center h-[50px]"
                  colSpan={tableData.headerCells.length}
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  );
};
