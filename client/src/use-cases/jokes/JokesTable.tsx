import { ServerJoke } from "api/jokes";
import {
  Table,
  TableCheckbox,
  TableData,
  TableMasterCheckbox,
} from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { Status } from "store/interfaces";
import { openEditJokeModal } from "store/jokes/editJokeModalSlice";
import {
  toggleSelectAll,
  toggleSelectItem,
  updateJokes,
} from "store/jokes/jokesTableSlice";

interface JokesTableRow {
  id: number;
  text: string;
  checkbox: React.JSX.Element;
}

export const JokesTable: React.FC = () => {
  const jokesTableState = useAppSelector((state) => state.joke.jokesTable);
  const dispatch = useAppDispatch();
  const headerCells = [
    <TableMasterCheckbox
      checked={jokesTableState.isAllSelected}
      onChange={() => dispatch(toggleSelectAll())}
      indeterminate={jokesTableState.isSomeSelected}
    />,
    "ID",
    "Joke text",
  ];
  const [jokesTableData, setJokesTableData] = React.useState<
    TableData<JokesTableRow>
  >({ headerCells, rows: [] });

  const getTableData = (jokes: ServerJoke[]): TableData<JokesTableRow> => {
    return {
      headerCells,
      rows: jokes.map((joke) => ({
        checkbox: (
          <TableCheckbox
            id={joke.id}
            checked={jokesTableState.selectedIds.includes(joke.id)}
            onChange={(id) => id && dispatch(toggleSelectItem(id))}
          />
        ),
        id: joke.id,
        text: (
          <span
            onClick={() =>
              dispatch(
                openEditJokeModal({
                  id: joke.id,
                  text: joke.text,
                })
              )
            }
            className="text-white hover:underline cursor-pointer"
          >
            {joke.text}
          </span>
        ),
      })),
    };
  };

  React.useEffect(() => {
    dispatch(updateJokes());
  }, []);

  React.useEffect(() => {
    setJokesTableData(getTableData(jokesTableState.jokes));
  }, [jokesTableState]);

  return (
    <Table
      tableData={jokesTableData}
      isLoading={jokesTableState.status === Status.LOADING}
    ></Table>
  );
};
