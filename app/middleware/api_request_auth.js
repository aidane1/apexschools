const route = require("path-match")({
    sensitive: false,
    strict: false,
    end: false,
});

// permission levels:
// -1: get resources
// 0: get resources, create resources, edit resources created by self, delete resources created by self
// 1: get resources, create resources, edit resources created by self, edit resources created by others, delete resources created by self
// 2: get resources, create resources, edit resources created by self, edit resources created by others, delete resources created by self, delete resources created by others
// 3: 

module.exports = {
    apiRequestAuth: async (req, res, next) => {
        try {
            let basePaths = [{path: "/api/:v/authenticate", methods: ["post"]}, {path: "/api/:v/accounts", methods: ["post"]}, {path: "/api/:v/schools", methods: ["post"]}];
            let isBase = false;
            for (var i = 0; i < basePaths.length; i++) {
                let isBasePath = route(basePaths[i].path);
                let match = isBasePath(req.url);
                if ((match !== false) && (basePaths[i].methods.indexOf(req.method.toLowerCase()) >= 0)) isBase = true;
            }
            if (isBase) {
                next();
            } else {
                let isApi = route("/api/*");
                let match = isApi(req.url);
                if (match !== false) {
                    let headers = req.headers;
                    let apikey = headers["x-api-key"];
                    let accountID = headers["x-id-key"];
                    if (apikey) {
                        if (accountID) {
                            let { account, key } = await models.apikey.authenticate(accountID, apikey);
                            let isAllowed = false;
                            for (var i = 0; i < key.authorized_routes.length; i++) {
                                let isAllowedPath = route(key.authorized_routes[i].path);
                                let match = isAllowedPath(req.url);
                                if ((match !== false) && (key.authorized_routes[i].methods.indexOf(req.method.toLowerCase()) >= 0 )) isAllowed = true;
                            }
                            if (isAllowed) {
                                let school = await models.school.findOne({_id : account.school});
                                req.account = account;
                                req.school = school;
                                next();
                            } else {
                                res.error("Accessing that route is unauthorized. Please try again.");
                            }
                        } else {
                            res.error("Account token not found. Please try again.");
                        }
                    } else {
                        res.error("API token not found. Please try again.");
                    }
                } else {
                    next();
                }
            }
        } catch(e) {
            console.log(e);
            if (e.message == "Invalid IV length") {
                res.error("Account token incorrectly encrypted. Please try again.")
            } else if (false) {

            } else {
                res.error(e);
            }
        }      
    }
}