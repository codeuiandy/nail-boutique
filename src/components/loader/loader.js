import HoldOn from "react-hold-on";

var options = {
  theme: "sk-dot",
  message: "Please Wait...",
  backgroundColor: "#1847B1",
  textColor: "red",
};
// HoldOn.open({
//   theme: "sk-cube-grid"
// })

export const showLoader = () => {
  HoldOn.open(options);
};

export const hideLoader = () => {
  HoldOn.close();
};
