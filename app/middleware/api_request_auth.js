const route = require ('path-match') ({
  sensitive: false,
  strict: false,
  end: false,
});

const url = require ('url');

const path = require ('path');

// permission levels:
// -1: get resources
// 0: get resources, create resources, edit resources created by self, delete resources created by self
// 1: get resources, create resources, edit resources created by self, edit resources created by others, delete resources created by self
// 2: get resources, create resources, edit resources created by self, edit resources created by others, delete resources created by self, delete resources created by others
// 3: edit administrator resources (teachers, semesters, etc...);

module.exports = {
  apiRequestAuth: async (req, res, next) => {
    try {
      let basePaths = [
        {path: '/api/:v/schools', methods: ['get']},
        {path: '/api/:v/authenticate', methods: ['post']},
        {path: '/api/:v/app', methods: ['post']},
        {path: '/api/:v/accounts', methods: ['post']},
      ];
      let isBase = false;
      for (var i = 0; i < basePaths.length; i++) {
        let isBasePath = route (basePaths[i].path);
        let match = isBasePath (url.parse (req.url).pathname);
        if (
          match !== false &&
          basePaths[i].methods.indexOf (req.method.toLowerCase ()) >= 0
        )
          isBase = true;
      }
      if (isBase) {
        next ();
      } else {
        let isApi = route ('/api/*');
        let match = isApi (url.parse (req.url).pathname);
        if (match !== false) {
          let headers = req.headers;
          let apikey = headers['x-api-key'];
          let accountID = headers['x-id-key'];
          if (apikey) {
            if (accountID) {
              let {account, key} = await models.apikey.authenticate (
                accountID,
                apikey
              );
              if (req.method.toLowerCase () == 'post') {
                req.body.uploaded_by = req.body.uploaded_by || account._id;
                req.body.username = account.username;
                req.body.school = account.school;
                req.body.date = req.body.date || new Date ();
              } else if (req.method.toLowerCase () == 'get') {
                req.body.school = account.school;
              }
              let allowedRoutes = account.getRoutes ()[
                req.method.toLowerCase ()
              ];
              let isAllowed = false;
              for (var i = 0; i < allowedRoutes.paths.length; i++) {
                let isAllowedPath = route (
                  path.join ('/api/:v', allowedRoutes.paths[i])
                );
                let match = isAllowedPath (url.parse (req.url).pathname);
                if (match !== false) isAllowed = true;
              }
              for (var i = 0; i < allowedRoutes.not.length; i++) {
                let isAllowedPath = route (
                  path.join ('/api/:v', allowedRoutes.not[i])
                );
                let match = isAllowedPath (url.parse (req.url).pathname);
                if (match !== false) isAllowed = false;
              }
              if (isAllowed) {
                let school = await models.school.findOne ({
                  _id: account.school,
                });
                req.account = account;
                req.school = school;

                let collection = route ('/api/:v/:c/');
                let collectionItem = route ('/api/:v/:c/:i');
                let matchCollection = collection (url.parse (req.url).pathname);
                let matchCollectionItem = collectionItem (
                  url.parse (req.url).pathname
                );
                if (
                  matchCollectionItem['c'] == 'vote' ||
                  matchCollectionItem['c'] == 'announcements' ||
                  matchCollectionItem['c'] == 'chatroom-keys'
                ) {
                  if (account.permission_level >= 0) {
                    next ();
                  } else {
                    res.error (
                      'Permission requirements not met. Please try again.'
                    );
                  }
                } else {
                  let resourceIsUserCreated = false;
                  let entireCollectionRequested = false;
                  if (matchCollectionItem !== false) {
                    let item = await pluralModels[
                      matchCollectionItem['c']
                    ].findOne ({_id: matchCollectionItem['i']});
                    if (
                      (item.uploaded_by &&
                        item.uploaded_by.toString () ===
                          account._id.toString ()) ||
                      item._id.toString () == account.reference_id.toString ()
                    ) {
                      resourceIsUserCreated = true;
                    }
                    if (
                      req.method.toLowerCase () == 'put' &&
                      Object.keys (req.body).length == 1 &&
                      Object.keys (req.body)[0] == 'response_resources'
                    ) {
                      resourceIsUserCreated = true;
                    }
                  } else if (matchCollection !== false) {
                    entireCollectionRequested = true;
                  }
                  let permissionLevels = 2;
                  if (entireCollectionRequested) {
                    permissionLevels = 0;
                  } else if (resourceIsUserCreated) {
                    permissionLevels = 0;
                  } else {
                    if (req.method === 'PUT') {
                      permissionLevels = 1;
                    } else if (req.method === 'GET') {
                      permissionLevels = -1;
                    }
                  }
                  if (account.permission_level >= permissionLevels) {
                    next ();
                  } else {
                    res.error (
                      'Permission requirements not met. Please try again.'
                    );
                  }
                }
              } else {
                res.error (
                  'Accessing that route is unauthorized. Please try again.'
                );
              }
            } else {
              res.error ('Account token not found. Please try again.');
            }
          } else {
            res.error ('API token not found. Please try again.');
          }
        } else {
          next ();
        }
      }
    } catch (e) {
      console.log (e);
      if (e.message == 'Invalid IV length') {
        res.error ('Account token incorrectly encrypted. Please try again.');
      } else if (e.name == 'CastError') {
        res.error ('Invalid resource ID. Please try again.');
      } else {
        res.error (e.message);
      }
    }
  },
};
