import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

function ShowSnackbar() {
  const snack = useSelector((state) => state.snackbar);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    console.log("snack", snack);
    if (snack.message.length > 0) {
      enqueueSnackbar(snack.message, {
        variant: snack.variant,
        autoHideDuration: 2000,
        preventDuplicate: true,
      });
    }
  }, [snack]);

  return <></>;
}

export default ShowSnackbar;
