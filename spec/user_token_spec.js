
const request = require("request");



const base_path = "http://127.0.0.1:8080/";


describe("Makes a request to the API", () => {
    let apiRequest = {
        headers: {
            "X-API-key": "_",
        },
        uri: base_path + "api/v1/resources",
        method: "GET",
    }
    it("It should return an error, without an account token", (done) => {
        request(apiRequest, (err, res, body) => {
            body = JSON.parse(body);
            expect(body.body.error).toBe("Account token not found. Please try again.");
            done();
        });
    });
})