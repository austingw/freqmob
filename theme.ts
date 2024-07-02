"use client";

import { Modal, createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "wild-pink",
  primaryShade: 6,
  colors: {
    "cool-blue": [
      "#dffcff",
      "#cbf4ff",
      "#9ae6ff",
      "#64d9ff",
      "#3ccdfe",
      "#24c5fe",
      "#00BBF9",
      "#00aae4",
      "#0098cc",
      "#0083b5",
    ],
    "electric-teal": [
      "#e1fffd",
      "#ccfff9",
      "#9cfff2",
      "#67ffea",
      "#42fee4",
      "#2dfee0",
      "#00F5D4",
      "#00e3c4",
      "#00caae",
      "#00af96",
    ],
    "happy-yellow": [
      "#fffce0",
      "#fff8ca",
      "#fef199",
      "#fee963",
      "#fee337",
      "#fedf19",
      "#FEE440",
      "#e2c300",
      "#c8ad00",
      "#ac9500",
    ],
    "wild-pink": [
      "#ffe9fb",
      "#ffd1ed",
      "#f9a2d7",
      "#f470bf",
      "#ef45ab",
      "#ed2a9f",
      "#F15BB5",
      "#d30885",
      "#bd0077",
      "#a60067",
    ],
    "swag-purp": [
      "#f7ebff",
      "#e7d5fc",
      "#cba8f3",
      "#ad7aeb",
      "#9451e3",
      "#8438df",
      "#9B5DE5",
      "#6a1dc6",
      "#5e19b2",
      "#51129c",
    ],
  },
  components: {
    Modal: Modal.extend({
      vars: (theme) => {
        return {
          root: {},
          title: {
            fontSize: theme.fontSizes.lg,
            fontWeight: 500,
          },
        };
      },
    }),
  },
});
