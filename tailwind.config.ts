import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        mainBg: "var(--mainBg)",
        gradOne: "var(--gradOne)",
        gradTwo: "var(--gradTwo)",
        cardOne: "var(--cardOne)",
        cardTwo: "var(--cardTwo)",
        linkColor: "var(--linkColor)",
        icon: "var(--icon)",
        camera: "var(--camera)",
        modalText: "var(--modalText)",
        leaderboardText: "var(--leaderboardText)",
        headerText: "var(--headerText)",
        mainText: "var(--mainText)",
        freeUseText: "var(--freeUseText)",
        bgFreeUse: "var(--bgFreeUse)",
        primaryBtnText: "var(--primaryBtnText)",
        secondaryBtnText: "var(--secondaryBtnText)",
      },
      gradientColorStopPositions: {
        33: "33%",
      },
      textAlign: {
        'justify': 'justify',
      },
      zIndex: {
        1: '1',
        5: '5',
        100: '100',
      },
      lineClamp: {
        1: '1',
        2: '2',
        3: '3',
        4: '4'
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  darkMode: "class"
};
export default config;
