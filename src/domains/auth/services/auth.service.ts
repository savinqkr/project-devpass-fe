import { GraphQLClient } from "graphql-request";
import {
    IAuthService,
    ICheckAccountIdAvailable,
    IEditUser,
    ILogin,
    IRefreshJwt,
    IRegisterUser,
} from "./auth.service.interface";
import {
    CheckAccountIdAvailableMutation,
    EditUserMutation,
    LoginMutation,
    RefreshJwtMutation,
    RegisterUserMutation,
} from "./graphql";

//
class AuthService implements IAuthService {
    private static instance: AuthService;

    private client = new GraphQLClient(
        process.env.NEXT_PUBLIC_HASURA_ENDPOINT ?? ""
    );

    public static get Instance(): AuthService {
        return this.instance || (this.instance = new this());
    }

    // 로그인
    public async login(args: ILogin.IInput): Promise<ILogin.IOutput> {
        try {
            const { login } = await this.client.request<
                LoginMutation.IResponse,
                LoginMutation.IVariable
            >(LoginMutation.Document, args);
            return { login };
        } catch (error: any) {
            switch (
                error["response"].errors[0].extensions.originalError.message
            ) {
                case "No User Exists":
                    alert("해당 아이디의 사용자는 존재하지 않습니다.");
                    break;
                case "Wrong Password":
                    alert("패스워스가 올바르지 않습니다.");
                    break;
                default:
                    alert("아이디 혹은 패스워스가 올바르지 않습니다.");
                    break;
            }
            console.error(error);
            throw error;
        }
    }

    // 세션 초기화
    public async refreshJwt(
        args: IRefreshJwt.IInput
    ): Promise<IRefreshJwt.IOutput> {
        try {
            const { refreshJwt } = await this.client.request<
                RefreshJwtMutation.IResponse,
                RefreshJwtMutation.IVariable
            >(RefreshJwtMutation.Document, args, {
                Authorization: `Bearer ${
                    localStorage.getItem("accessToken") as string
                }`,
            });
            return { refreshJwt };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 사용자 등록을 위한 아이디 중복체크
    public async checkAccountIdAvailable(
        args: ICheckAccountIdAvailable.IInput
    ): Promise<boolean> {
        try {
            const { isAccountIdAvailable } = await this.client.request<
                CheckAccountIdAvailableMutation.IResponse,
                CheckAccountIdAvailableMutation.IVariable
            >(CheckAccountIdAvailableMutation.Document, args, {
                Authorization: `Bearer ${
                    localStorage.getItem("accessToken") as string
                }`,
            });

            return isAccountIdAvailable;
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 사용자 등록
    public async registerUser(
        args: IRegisterUser.IInput
    ): Promise<IRegisterUser.IOutput> {
        try {
            const { registerUser } = await this.client.request<
                RegisterUserMutation.IResponse,
                RegisterUserMutation.IVariable
            >(RegisterUserMutation.Document, args, {
                Authorization: `Bearer ${
                    localStorage.getItem("accessToken") as string
                }`,
            });

            return { registerUser };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }

    // 사용자 수정
    public async editUser(args: IEditUser.IInput): Promise<IEditUser.IOutput> {
        try {
            const { editUser } = await this.client.request<
                EditUserMutation.IResponse,
                EditUserMutation.IVariable
            >(EditUserMutation.Document, args, {
                Authorization: `Bearer ${
                    localStorage.getItem("accessToken") as string
                }`,
            });

            return { editUser };
        } catch (error: any) {
            alert(error["response"].errors[0]["message"]);
            throw error;
        }
    }
}

export default AuthService.Instance;
