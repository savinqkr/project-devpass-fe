import { css } from "@emotion/react";
import { ILoginForm } from "./LoginForm.interface";
import {
    Button,
    IconButton,
    InputAdornment,
    OutlinedInput,
    TextField,
    useMediaQuery,
} from "@mui/material";
import BasicButton from "@common/components/basic-button/BasicButton.impl";
import { ButtonType } from "src/enums/button-type.enum";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ScreenType } from "@enums";
import { Colors } from "@configs/colors";

const VLoginForm: React.FC<ILoginForm.IVProps> = props => {
    const isMedium = useMediaQuery(`(max-width:${ScreenType.medium}px)`);

    const { register, onClickLogin, isPwVisible, onClickShowPw } = props;

    return (
        <form
            autoComplete="off"
            css={rootStyle(isMedium)}
            onSubmit={onClickLogin}
        >
            <TextField
                className="textfield"
                placeholder="ID"
                {...register("id")}
                InputProps={{
                    style: {
                        height: 48,
                        fontSize: 16,
                        color: `${Colors.charcoalGray}`,
                    },
                }}
                sx={{ backgroundColor: Colors.white, borderRadius: "3px" }}
            />
            <OutlinedInput
                className="textfield"
                placeholder="PW"
                {...register("password")}
                type={isPwVisible ? "text" : "password"}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={onClickShowPw} edge="end">
                            {isPwVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                sx={{
                    backgroundColor: Colors.white,
                    borderRadius: "3px",
                    height: "48px",
                }}
            />
            <div className="submit-btn">
                {/* <BasicButton
                    type={ButtonType.CONTAINED}
                    isSubmitBtn={true}
                    width={isMedium ? "50vw" : "32vw"}
                    height="48px"
                    title="로그인"
                    color="charcoalGray"
                /> */}
                <Button
                    sx={{ width: 500, height: 48 }}
                    variant="contained"
                    type="submit"
                    color="charcoalGray"
                    disableElevation
                >
                    로그인
                </Button>
            </div>
        </form>
    );
};

export default VLoginForm;

const rootStyle = (isMedium: boolean) => css`
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .textfield {
        /* width: ${isMedium ? "50vW" : "32vw"}; */
        width: 500px;
        margin-top: 20px;
    }

    .submit-btn {
        margin-top: 40px;
    }
`;
