import SignupBusiness from "../src/business/SignupBusiness";
import User, { UserRole } from "../src/model/User";
import UserDB from "../src/data/UserDB";

describe("Testing SignupBusiness", () => {
    let userDB = {};
    let cypher = {};
    let idGenerator = {};
    let authorizer = {};

    test("Should return 'Missing data' for empty email", async () => {
        expect.assertions(2);
        try {
            const signupBusiness = new SignupBusiness(
                userDB as any,
                cypher as any,
                idGenerator as any,
                authorizer as any
            );

            let input: any = {
                name: "Hugo",
                email: "",
                username: "hugolar",
                role: "PREMIUN LISTENER",
                password: "SENHA",
                isApproved: true,
                isBlocked: false
            }

            await signupBusiness.execute(input, undefined, undefined);

        } catch (error) {
            expect(error.customErrorCode).toBe(422);
            expect(error.message).toBe('Missing data');
        }
    })
    test("Should return 'Missing band description' for empty description when role is BAND", async () => {
        expect.assertions(2);
        try {
            const signupBusiness = new SignupBusiness(
                userDB as any,
                cypher as any,
                idGenerator as any,
                authorizer as any
            );

            let input: any = {
                name: "Hugo",
                email: "H@H.com",
                username: "hugolar",
                role: "BAND",
                password: "SENHA",
                isApproved: true,
                isBlocked: false
            }

            await signupBusiness.execute(input, undefined, undefined);

        } catch (error) {
            expect(error.customErrorCode).toBe(422);
            expect(error.message).toBe('Missing band description');
        }
    })
    test("Should return 'The password is too short, the mandatory minimum length is 6' for password < 6 when role is not ADMIN", async () => {
        expect.assertions(2);
        try {
            const signupBusiness = new SignupBusiness(
                userDB as any,
                cypher as any,
                idGenerator as any,
                authorizer as any
            );

            let input: any = {
                name: "Hugo",
                email: "H@H.com",
                username: "hugolar",
                role: "PREMIUN LISTENER",
                password: "SENHA",
                isApproved: true,
                isBlocked: false
            }

            await signupBusiness.execute(input, undefined, undefined);

        } catch (error) {
            expect(error.customErrorCode).toBe(422);
            expect(error.message).toBe('The password is too short, the mandatory minimum length is 6');
        }
    })
    test("Should return 'The password is too short, the mandatory admin minimum length is 10' for password < 10 when role is ADMIN", async () => {
        expect.assertions(2);
        try {
            const signupBusiness = new SignupBusiness(
                userDB as any,
                cypher as any,
                idGenerator as any,
                authorizer as any
            );

            let input: any = {
                name: "Hugo",
                email: "H@H.com",
                username: "hugolar",
                role: "ADMIN",
                password: "SENHAAA",
                isApproved: true,
                isBlocked: false
            }

            await signupBusiness.execute(input, undefined, undefined);

        } catch (error) {
            expect(error.customErrorCode).toBe(422);
            expect(error.message).toBe('The password is too short, the mandatory admin minimum length is 10');
        }
    })
    test("Should return 'Admin level required to create another admin account' for user role creating an admin user is not an admin", async () => {
        expect.assertions(2);

        try {

            const retrieveDataFromToken = jest.fn((authorization: string) => {
                return {
                    userRole: "PREMIUN LISTENER"
                }
            })

            authorizer = { retrieveDataFromToken };

            const signupBusiness = new SignupBusiness(
                userDB as any,
                cypher as any,
                idGenerator as any,
                authorizer as any
            );

            let input: any = {
                name: "Hugo",
                email: "H@H.com",
                username: "hugolar",
                role: "ADMIN",
                password: "SENHASENHA",
                isApproved: true,
                isBlocked: false
            }

            await signupBusiness.execute(input, undefined, "authorization");

        } catch (error) {
            expect(error.customErrorCode).toBe(403);
            expect(error.message).toBe('Admin level required to create another admin account');
        }
    })
})