import { alpha, createTheme } from "@mui/material/styles";
import { Colors } from "./colors";

// 팔레트 정의
declare module "@mui/material/styles" {
    interface Palette {
        black: Palette["primary"];
        charcoalGray: Palette["primary"];
        gray: Palette["primary"];
        grayC: Palette["primary"];
        softGray: Palette["primary"];
        lightGray: Palette["primary"];
        creamyWhite: Palette["primary"];
        white: Palette["primary"];
        oceanBlue: Palette["primary"];
        lightBlue: Palette["primary"];
        deepBlue: Palette["primary"];
        royalBlue: Palette["primary"];
        excelGreen: Palette["primary"];
        wildStrawberry: Palette["primary"];
        deepPurple: Palette["primary"];
        lightPurple: Palette["primary"];
        lavenderPurple: Palette["primary"];
    }

    interface PaletteOptions {
        black?: PaletteOptions["primary"];
        charcoalGray?: PaletteOptions["primary"];
        gray?: PaletteOptions["primary"];
        grayC?: PaletteOptions["primary"];
        softGray?: PaletteOptions["primary"];
        lightGray?: PaletteOptions["primary"];
        creamyWhite?: PaletteOptions["primary"];
        white?: PaletteOptions["primary"];
        oceanBlue?: PaletteOptions["primary"];
        lightBlue?: PaletteOptions["primary"];
        deepBlue?: PaletteOptions["primary"];
        royalBlue?: PaletteOptions["primary"];
        excelGreen?: PaletteOptions["primary"];
        wildStrawberry?: PaletteOptions["primary"];
        deepPurple?: PaletteOptions["primary"];
        lightPurple?: PaletteOptions["primary"];
        lavenderPurple?: PaletteOptions["primary"];
    }
}

// 추가한 옵션들을 포함하도록 설정
declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        black: true;
        charcoalGray: true;
        gray: true;
        grayC: true;
        softGray: true;
        lightGray: true;
        creamyWhite: true;
        white: true;
        oceanBlue: true;
        lightBlue: true;
        deepBlue: true;
        royalBlue: true;
        excelGreen: true;
        wildStrawberry: true;
        deepPurple: true;
        lightPurple: true;
        lavenderPurple: true;
    }
}
declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        black: true;
        charcoalGray: true;
        gray: true;
        grayC: true;
        softGray: true;
        lightGray: true;
        creamyWhite: true;
        white: true;
        oceanBlue: true;
        lightBlue: true;
        deepBlue: true;
        royalBlue: true;
        excelGreen: true;
        wildStrawberry: true;
        deepPurple: true;
        lightPurple: true;
        lavenderPurple: true;
    }
}
declare module "@mui/material/IconButton" {
    interface IconButtonPropsColorOverrides {
        black: true;
        charcoalGray: true;
        gray: true;
        grayC: true;
        softGray: true;
        lightGray: true;
        creamyWhite: true;
        white: true;
        oceanBlue: true;
        lightBlue: true;
        deepBlue: true;
        royalBlue: true;
        excelGreen: true;
        wildStrawberry: true;
        deepPurple: true;
        lightPurple: true;
        lavenderPurple: true;
    }
}
declare module "@mui/material/Radio" {
    interface IconButtonPropsColorOverrides {
        black: true;
        charcoalGray: true;
        gray: true;
        grayC: true;
        softGray: true;
        lightGray: true;
        creamyWhite: true;
        white: true;
        oceanBlue: true;
        lightBlue: true;
        deepBlue: true;
        royalBlue: true;
        excelGreen: true;
        wildStrawberry: true;
        deepPurple: true;
        lightPurple: true;
        lavenderPurple: true;
    }
}
declare module "@mui/material/Switch" {
    interface SwitchPropsColorOverrides {
        black: true;
        charcoalGray: true;
        gray: true;
        grayC: true;
        softGray: true;
        lightGray: true;
        creamyWhite: true;
        white: true;
        oceanBlue: true;
        lightBlue: true;
        deepBlue: true;
        royalBlue: true;
        excelGreen: true;
        wildStrawberry: true;
        deepPurple: true;
        lightPurple: true;
        lavenderPurple: true;
    }
}

const theme = createTheme({
    palette: {
        black: {
            main: alpha(Colors.black, 1.0),
            light: alpha(Colors.black, 0.5),
            dark: alpha(Colors.black, 0.9),
            contrastText: "#fff",
        },
        charcoalGray: {
            main: alpha(Colors.charcoalGray, 1.0),
            light: alpha(Colors.charcoalGray, 0.5),
            dark: alpha(Colors.charcoalGray, 0.9),
            contrastText: "#fff",
        },
        gray: {
            main: alpha(Colors.gray, 1.0),
            light: alpha(Colors.gray, 0.5),
            dark: alpha(Colors.gray, 0.9),
            contrastText: "#fff",
        },
        grayC: {
            main: alpha(Colors.grayC, 1.0),
            light: alpha(Colors.grayC, 0.5),
            dark: alpha(Colors.grayC, 0.9),
            contrastText: "#000",
        },
        softGray: {
            main: alpha(Colors.softGray, 1.0),
            light: alpha(Colors.softGray, 0.5),
            dark: alpha(Colors.softGray, 0.9),
            contrastText: "#fff",
        },
        lightGray: {
            main: alpha(Colors.lightGray, 1.0),
            light: alpha(Colors.lightGray, 0.5),
            dark: alpha(Colors.lightGray, 0.9),
            contrastText: "#fff",
        },
        creamyWhite: {
            main: alpha(Colors.creamyWhite, 1.0),
            light: alpha(Colors.creamyWhite, 0.5),
            dark: alpha(Colors.creamyWhite, 0.9),
            contrastText: "#000",
        },
        white: {
            main: alpha(Colors.white, 1.0),
            light: alpha(Colors.white, 0.5),
            dark: alpha(Colors.white, 0.9),
            contrastText: "#000",
        },
        oceanBlue: {
            main: alpha(Colors.oceanBlue, 1.0),
            light: alpha(Colors.oceanBlue, 0.5),
            dark: alpha(Colors.oceanBlue, 0.9),
            contrastText: "#fff",
        },
        lightBlue: {
            main: alpha(Colors.lightBlue, 1.0),
            light: alpha(Colors.lightBlue, 0.5),
            dark: alpha(Colors.lightBlue, 0.9),
            contrastText: "#fff",
        },
        deepBlue: {
            main: alpha(Colors.deepBlue, 1.0),
            light: alpha(Colors.deepBlue, 0.5),
            dark: alpha(Colors.deepBlue, 0.9),
            contrastText: "#fff",
        },
        royalBlue: {
            main: alpha(Colors.royalBlue, 1.0),
            light: alpha(Colors.royalBlue, 0.5),
            dark: alpha(Colors.royalBlue, 0.9),
            contrastText: "#fff",
        },
        excelGreen: {
            main: alpha(Colors.excelGreen, 1.0),
            light: alpha(Colors.excelGreen, 0.5),
            dark: alpha(Colors.excelGreen, 0.9),
            contrastText: "#fff",
        },
        wildStrawberry: {
            main: alpha(Colors.wildStrawberry, 1.0),
            light: alpha(Colors.wildStrawberry, 0.5),
            dark: alpha(Colors.wildStrawberry, 0.9),
            contrastText: "#fff",
        },
        deepPurple: {
            main: alpha(Colors.deepPurple, 1.0),
            light: alpha(Colors.deepPurple, 0.5),
            dark: alpha(Colors.deepPurple, 0.9),
            contrastText: "#fff",
        },
        lightPurple: {
            main: alpha(Colors.lightPurple, 1.0),
            light: alpha(Colors.lightPurple, 0.5),
            dark: alpha(Colors.lightPurple, 0.9),
            contrastText: "#fff",
        },
        lavenderPurple: {
            main: alpha(Colors.lavenderPurple, 1.0),
            light: alpha(Colors.lavenderPurple, 0.5),
            dark: alpha(Colors.lavenderPurple, 0.9),
            contrastText: "#fff",
            // 삭제하지 마세요
            // getContrastRatio(alpha(Colors.wildStrawberry, 0.7), "#fff") >
            // 4.5
            //     ? "#fff"
            //     : "#111",
        },
    },
});

export default theme;
