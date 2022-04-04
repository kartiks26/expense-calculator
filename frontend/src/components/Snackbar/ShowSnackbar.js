import React from "react";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { closeSnackBar } from "../../slice/snackBarSlice.js";
function ShowSnackbar() {
  const snack = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();
  const Vertical = "bottom";
  const Horizontal = "left";
  return (
    <Snackbar
      open={snack.visible}
      TransitionComponent={Slide}
      onClick={() => dispatch(closeSnackBar())}
      onClose={() => dispatch(closeSnackBar())}
      message={snack.message}
      key={new Date()}
      variant="filled"
      color="primary"
      anchorOrigin={{ vertical: Vertical, horizontal: Horizontal }}
      autoHideDuration={3000}
    />
  );
}

export default ShowSnackbar;
