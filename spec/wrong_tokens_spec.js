
const request = require("request");



const base_path = "http://127.0.0.1:8080/";


describe("Makes a request to the API", () => {
    let apiRequest = {
        headers: {
            "X-API-key": "_",
            "X-ID-key": "_",
        },
        uri: base_path + "api/v1/resources",
        method: "GET",
    }
    it("It should return an error, because the tokens are invalid", (done) => {
        request(apiRequest, (err, res, body) => {
            body = JSON.parse(body);
            expect(body.body.error).toBe("Account token incorrectly encrypted. Please try again.");
            done();
        });
    });
})
