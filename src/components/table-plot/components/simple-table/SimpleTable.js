/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import formatValue from '../../../../utils/formatValue';
import getD3DataFormatter from '../../../../utils/getD3DataFormatter';

function CellRenderer(props) {
  return (
    <div> {formatValue(getD3DataFormatter(props.column.formatter, props.value), props.value)} </div>
  );
}

function SimpleTable({ columns = [], data }) {
  const tableColumns = useMemo(
    () =>
      columns.map((column) => {
        return {
          Header: column.label,
          accessor: column.value,
          formatter: column.formatter,
          Cell: CellRenderer,
        };
      }),
    [columns]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns: tableColumns,
    data,
  });

  const thProps = {
    margin: 0,
    padding: '0.5rem',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
  };
  const tdProps = {
    margin: 0,
    padding: '0.5rem',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
  };

  return (
    <table {...getTableProps()} style={{ borderSpacing: 0, height: '100%', width: '100%' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, columnIndex) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  ...thProps,
                  borderRight:
                    headerGroup.headers.length - 1 === columnIndex ? '0' : '1px solid black',
                }}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, cellIndex) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      ...tdProps,
                      borderRight: row.cells.length - 1 === cellIndex ? '0' : '1px solid black',
                      borderBottom: rows.length - 1 === rowIndex ? '0' : '1px solid black',
                    }}>
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

SimpleTable.propTypes = {};

export default SimpleTable;
