export const barChartDataDailyTraffic = [
  {
    name: "APIs",
    data: [1, 2, 2],
  },
];

export const barChartOptionsDailyTraffic = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: ["High", "Medium", "Low", "None"],
    show: true,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#CBD5E0",
        fontSize: "14px",
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: "#4318FF",
            opacity: 1,
          },
          {
            offset: 100,
            color: "rgba(67, 24, 255, 1)",
            opacity: 0.28,
          },
        ],
      ],
    },
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "50px",
    },
  },
};

export const pieChartOptions = {
  labels: [
    "Broken Authentication",
    "BOLA",
    "Security Misconfiguration",
    "Unrestricted Resource Consumption",
    "Server-Side Request Forgery",
  ],
  colors: ["#4318FF", "#6AD2FF", "#A8A8A8", "#050C9C", "#A7E6FF"],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: true,
  },
  dataLabels: {
    enabled: true,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#A8A8A8", "#050C9C", "#A7E6FF"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
  },
};

export const pieChartData = [5, 2, 3, 1, 2];

export const countryChartOptions = {
  labels: [
    "India",
    "Pakistan",
    "United States of America",
    "China",
    "United Kingdom",
  ],
  colors: ["#4318FF", "#6AD2FF", "#A8A8A8", "#050C9C", "#A7E6FF"],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: true,
  },
  dataLabels: {
    enabled: true,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
        },
      },
    },
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#A8A8A8", "#050C9C", "#A7E6FF"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
  },
};

export const countryChartData = [7, 1, 3, 12, 2];

export const lineChartDataTotalSpent = [
  {
    name: "Revenue",
    data: [50, 64, 48, 66, 49, 68],
    color: "#4318FF",
  },
  {
    name: "Profit",
    data: [30, 40, 24, 46, 20, 46],
    color: "#6AD2FF",
  },
];

export const singleLineChartDataTotalSpent = [
  {
    name: "Revenue",
    data: [20, 0, 0, 0, 49, 68, 39],
    color: "#4318FF",
  },
];

export const lineChartOptionsTotalSpent = {
  legend: {
    show: false,
  },

  theme: {
    mode: "light",
  },
  chart: {
    type: "line",

    toolbar: {
      show: false,
    },
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },

  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
    theme: "dark",
    x: {
      format: "dd/MM/yy HH:mm",
    },
  },
  grid: {
    show: true,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500",
      },
    },
    type: "text",
    range: undefined,
    // Add last 7 days Dates as y labels in format 9 Sept
    categories: [
      new Date(new Date().setDate(new Date().getDate() - 6)).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      new Date(new Date().setDate(new Date().getDate() - 4)).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      new Date(new Date().setDate(new Date().getDate() - 3)).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString(
        "en-US",
        {
          day: "2-digit",
          month: "short",
        }
      ),
      new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }),
    ],
  },

  yaxis: {
    show: true,
  },
};

export const colorSamples = [
  "#4318FF",
  "#6AD2FF",
  "#A8A8A8",
  "#050C9C",
  "#A7E6FF",
];
