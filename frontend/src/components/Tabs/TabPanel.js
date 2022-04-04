import * as React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useSelector, useDispatch } from "react-redux";
import { Chart } from "react-google-charts";
import { updateFilterList } from "../../slice/otherStatesSlice";
const baseUrl = process.env.REACT_APP_API_URL;
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BasicTabs() {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const transaction = useSelector((state) => state.transaction);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
    switch (newValue) {
      case 0:
        dispatch(updateFilterList([]));
        break;
      case 1:
        dispatch(updateFilterList(["Debit"]));
        break;
      case 2:
        dispatch(updateFilterList(["Credit"]));

        break;
      case 3:
        dispatch(updateFilterList(["Investment"]));
        break;
      case 4:
        dispatch(updateFilterList(["Lend", "Lend Recovered"]));
        break;
      default:
        break;
    }
  };
  const [AccountBalance, setAccountBalance] = React.useState(0);
  const [MoneyLend, setMoneyLend] = React.useState(0);
  const [MoneyDebited, setMoneyDebited] = React.useState(0);
  const [MoneyCredited, setCredited] = React.useState(0);
  const [Investment, setInvestment] = React.useState(0);
  React.useEffect(() => {
    fetch(
      `${baseUrl}/transaction/getAccountBalance/${localStorage.getItem(
        "ExpenseUserContactNumber"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAccountBalance(data.AccountBalance);
      });
    fetch(
      `${baseUrl}/transaction/getCredit/${localStorage.getItem(
        "ExpenseUserContactNumber"
      )}/Lend`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMoneyLend(data.Amount);
      });
    fetch(
      `${baseUrl}/transaction/getCredit/${localStorage.getItem(
        "ExpenseUserContactNumber"
      )}/Debit`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMoneyDebited(data.Amount);
      });
    fetch(
      `${baseUrl}/transaction/getCredit/${localStorage.getItem(
        "ExpenseUserContactNumber"
      )}/Credit`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCredited(data.Amount);
      });
    fetch(
      `${baseUrl}/transaction/getCredit/${localStorage.getItem(
        "ExpenseUserContactNumber"
      )}/Investment`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setInvestment(data.Amount);
      });
  }, [transaction]);
  const data = [
    ["Pizza", "Popularity"],
    ["Account Balance", (AccountBalance / MoneyCredited) * 100],
    ["Investment", (Investment / MoneyCredited) * 100],
    ["Money Lend", (MoneyLend / MoneyCredited) * 100],
    ["Money Spent", (MoneyDebited / MoneyCredited) * 100],
  ];
  const options = {
    title: "Chart Based on Money Credited",
    backgroundColor: "#fafafa",
    pieHole: 0.4,
    colors: ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c"],
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="account Balance" />
          <Tab label="Money Spend" />
          <Tab label="Money Credited" />
          <Tab label="Money Invested" />
          <Tab label="Money Lend" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Account Balance is {AccountBalance}
        <Chart
          loader={<div>Loading Chart</div>}
          chartType="PieChart"
          data={data}
          width="100%"
          height="350px"
          legendToggle
          options={options}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        Money Spend is {MoneyDebited}
      </TabPanel>
      <TabPanel value={value} index={2}>
        Money Credited is {MoneyCredited}
      </TabPanel>
      <TabPanel value={value} index={3}>
        Money Invested is {Investment}
      </TabPanel>
      <TabPanel value={value} index={4}>
        Money Lend is {MoneyLend}
      </TabPanel>
    </Box>
  );
}
