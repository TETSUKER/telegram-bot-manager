import React from "react";

export interface TableData<T> {
  headerCells: (string | React.ReactNode)[];
  rows: { [Key in keyof T]: T[Key] | React.ReactNode }[];
}

interface TableProps<T> {
  tableData: TableData<T>;
}

type TableComponent<T = any> = React.FC<TableProps<T>>;

export const Table: TableComponent = ({ tableData }) => {
  return (
    tableData && (
      <table className="table-auto font-white text-white bg-slate-900 border-none rounded-lg w-full overflow-hidden">
        <thead>
          <tr>
            {tableData.headerCells.map((column, index) => (
              <th key={index} className="border px-[20px] py-[10px] border-none text-start">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-slate-800'>
          {tableData.rows.length ? tableData.rows.map((row, index) => (
            <tr key={index} className='even:bg-slate-900'>
              {Object.keys(row).map((key, index) => (
                <td key={index} className="border px-[20px] py-[10px] border-none">
                  {row[key]}
                </td>
              ))}
            </tr>
          )) : <tr><td className='text-center h-[50px]' colSpan={tableData.headerCells.length}>No data</td></tr>}
        </tbody>
      </table>
    )
  );
};
