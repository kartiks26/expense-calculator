import MUIDataTable, { TableFilterList, TableHead } from "mui-datatables";
import React, { useEffect, useState } from "react";
import "./expense.css";
import Button from "@material-ui/core/Button";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import DateChange from "../DateChange";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTransactions,
  DeleteTransaction,
  RecoverLendTransaction,
} from "../../slice/transactionSlice";
// delete icon
import Fab from "@material-ui/core/Fab";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import AddExpense from "../AddExpense/AddExpense";
import BasicTabs from "../Tabs/TabPanel";
import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";
import Loader from "../Loader/Loader";
// here I set the them
const getMuiTheme = createTheme({
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "3px solid white",
        borderRight: "1px solid white",
        cursor: "pointer",
        textAlign: "center",
        padding: "25px",
      },
    },
  },
});

const data = [];

function Expense() {
  useEffect(() => {
    dispatch(fetchTransactions());
  }, []);
  const data = useSelector((state) => state.transaction);
  const loading = useSelector((state) => state.otherStates.loader);

  const filterLists = useSelector((state) => state.otherStates.filterList);
  const dispatch = useDispatch();
  const options = {
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30],
    filter: true,
    searchOpen: false,
    search: false,
    outerHeight: "100vh",
    fixedHeader: true,
    selectableRowsOnClick: true,
    responsive: "scrollMaxHeight",
    onRowClick: (rowData, rowMeta) => {
      // console.log(rowData[5]);
    },

    onRowsDelete: (rowsDeleted) => {
      console.log(data[rowsDeleted.data[0].index]);
      rowsDeleted.data.forEach((rowDeleted) => {
        dispatch(DeleteTransaction(data[rowDeleted.index].id));
      });
    },
    rowHover: true,
    customToolbar: () => {
      return (
        <Fab
          variant="extended"
          size="small"
          aria-label="add"
          color="primary"
          style={{
            opacity: "1",
            padding: "0px 20px 0px 10px",
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          <AddIcon
            color="black"
            size="small"
            onClick={() => {
              setOpen(true);
            }}
          />
          Add
        </Fab>
      );
    },
    filterType: "dropdown",
    backgroundColor: "black",
    elevation: 0,
    textAlign: "center",
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      let selectedType = [];
      console.log(selectedRows);
      selectedRows.data.forEach((row) => {
        selectedType.push(data[row.dataIndex].Type);
        console.log(selectedType);
      });
      if (
        (selectedType.includes("Debit") ||
          selectedType.includes("Credit") ||
          selectedType.includes("Investment") ||
          selectedType.includes("Lend Recovered")) &&
        !selectedType.includes("Lend")
      ) {
        console.log("yes");
        return (
          <div>
            <Fab
              size="small"
              style={{
                margin: "0px 10px",
              }}
              aria-label="add"
              onClick={() => {
                selectedRows.data.forEach((rowDeleted) => {
                  dispatch(DeleteTransaction(data[rowDeleted.dataIndex].id));
                });
                setSelectedRows([]);
              }}
            >
              <DeleteIcon color="black" size="small" onClick={() => {}} />
            </Fab>
          </div>
        );
      } else if (
        selectedType.includes("Lend") &&
        !(
          selectedType.includes("Debit") ||
          selectedType.includes("Credit") ||
          selectedType.includes("Investment") ||
          selectedType.includes("Lend Recovered")
        )
      ) {
        return (
          <div>
            <Fab
              color="primary"
              size="small"
              style={{
                margin: "0px 10px",
              }}
              aria-label="add"
              onClick={() => {
                selectedRows.data.forEach((rowDeleted) => {
                  dispatch(
                    RecoverLendTransaction(data[rowDeleted.dataIndex].id)
                  );
                });
                setSelectedRows([]);
              }}
            >
              <CheckIcon color="black" size="small" />
            </Fab>
          </div>
        );
        // CheckIcon
      } else {
        return (
          <div>
            {/* ErrorIcon */}
            <Fab
              disabled
              color="error"
              size="small"
              style={{
                margin: "0px 10px",
              }}
              aria-label="add"
            >
              <ErrorIcon color="error" size="small" onClick={() => {}} />
            </Fab>
          </div>
        );
      }
    },
    downloadOptions: {
      filename: "transactions.csv",
      separator: ",",
      filterOptions: {
        useDisplayedColumnsOnly: false,
        useDisplayedRowsOnly: false,
      },
    },
    setRowProps: (row) => {
      if (row[1] === "Debit") {
        return {
          style: {
            backgroundColor: "#A7BCDD ",
            width: "10%",
          },
        };
      } else if (row[1] === "Lend") {
        return {
          style: {
            backgroundColor: "#D3DEA7",
          },
        };
      } else {
        return {
          style: { backgroundColor: "#D3DEEE", width: "10%" },
        };
      }
    },
  };
  const columns = [
    {
      name: "Transaction",
      label: "Transaction",
      options: {
        caseSensitive: false,
        filter: false,
        sort: false,
      },
    },
    {
      name: "Type",
      label: "Type",
      options: {
        filter: true,
        sort: false,
        filterList: filterLists,
        // customBodyRender: (value, rowData, updateValue) => {
        //   return (
        //     <Select
        //       value={value}
        //       className="MoboResponsive"
        //       onChange={(e) => {
        //         console.log(rowData.rowData[5]);
        //         updateValue(e.target.value);
        //       }}
        //     >
        //       <MenuItem value="Debit">Debit</MenuItem>
        //       <MenuItem value="Credit">Credit</MenuItem>
        //     </Select>
        //   );
        // },
      },
    },

    {
      name: "Amount",
      label: "Amount",
      options: {
        filter: false,
        sort: false,
      },
    },

    {
      name: "Date",
      label: "Date",
      options: {
        filter: false,
        sort: false,
        // customBodyRender: (value, rowData, updateValue) => {
        //   return <h4> {value}</h4>;
        //   // return <DateChange value={value} id={rowData.rowData[5]} />;
        // },
      },
    },
    {
      name: "Description",
      label: "Description",
      options: {
        display: false,
        filter: false,
        sort: false,
      },
    },
    {
      name: "id",
      options: {
        viewColumns: false,
        display: false,
        filter: false,
      },
    },
  ];
  const [open, setOpen] = React.useState(false);
  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="expenseHeader">
        <BasicTabs />
        <div className="ExpenseToolBar">
          <AddExpense open={open} setOpen={setOpen} />
          {/* <Button variant="contained" color="primary" className="Button">
            Add Transaction
          </Button>{" "}
          <Button variant="contained" color="primary" className="Button">
            Add Transaction
          </Button> */}
        </div>
      </div>
      <div className="TableWrapper">
        <MuiThemeProvider theme={getMuiTheme}>
          <MUIDataTable
            style={{
              tableLayout: "fixed",
            }}
            title={"Transactions"}
            data={data}
            columns={columns}
            options={options}
            className="expenseTable"
          />
        </MuiThemeProvider>
      </div>
    </>
  );
}

export default Expense;
