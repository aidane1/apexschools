module.exports = () => {
  global.bindAction ('token-update', async (method, resource) => {
    try {
      console.log (resource);
      let token = {
        helpfulness: 1,
        _id: resource._id,
        tokens: 3,
        mature: false,
        date: new Date (),
      };

      let pushString = {'interaction_tokens.created_important_dates': token};

      switch (resource.collection) {
        case 'assignments':
          token.tokens = 5;
          pushString = {'interaction_tokens.created_assignments': token};
          break;
        case 'notes':
          token.tokens = 3;
          pushString = {'interaction_tokens.created_notes': token};
          break;
        case 'comments':
          token.tokens = 3;
          pushString = {'interaction_tokens.created_comments': token};
          break;
        case 'posts':
          token.tokens = 5;
          pushString = {'interaction_tokens.created_posts': token};
          break;
        case 'important-dates':
          token.tokens = 3;
          pushString = {'interaction_tokens.created_important_dates': token};
          break;
      }
      console.log ({pushString});
      let user = await models['user'].findOneAndUpdate (
        {_id: resource.uploaded_by},
        {$push: pushString},
        {new: true}
      );
      console.log (user.interaction_tokens);
    } catch (e) {
      console.log (e);
    }
  });

  global.bindAction ('token-delete', async (method, resource) => {
    try {
      let pullString = {
        'interaction_tokens.created_important_dates': {_id: resource._id},
      };
      let updateMany = {
        'interaction_tokens.votes': {_id: resource._id},
      };
      switch (resource.collection) {
        case 'assignments':
          pullString = {
            'interaction_tokens.created_assignments': {_id: resource._id},
          };
          break;
        case 'notes':
          pullString = {
            'interaction_tokens.created_notes': {_id: resource._id},
          };
          break;
        case 'comments':
          pullString = {
            'interaction_tokens.created_comments': {_id: resource._id},
          };
          updateMany = {
            'interaction_tokens.created_comments': {parents: resource.parents},
            'interaction_tokens.votes': {_id: resource._id},
          };
          break;
        case 'posts':
          pullString = {
            'interaction_tokens.created_posts': {_id: resource._id},
          };
          updateMany = {
            'interaction_tokens.created_comments': {parents: resource.parents},
            'interaction_tokens.votes': {_id: resource._id},
          };
          break;
        case 'important-dates':
          pullString = {
            'interaction_tokens.created_important_dates': {_id: resource._id},
          };
          break;
      }
      console.log (pullString);
      let user = await models['user'].findOneAndUpdate (
        {_id: resource.uploaded_by},
        {$pull: pullString},
        {new: true}
      );
      if (updateMany !== false) {
        await models['user'].updateMany (
          {school: resource.school},
          {$pull: updateMany}
        );
      }
      console.log (user);
    } catch (e) {
      console.log (e);
    }
  });

  global.bindAction ('vote-change', async (method, resource) => {
    try {
      let voteToken = {
        collection: resource.collection,
        _id: resource._id,
        tokens: 1,
        mature: false,
        date: new Date (),
      };
      let resourceToken = {
        helpfulness: 1,
        _id: resource._id,
        tokens: 3,
        mature: false,
        date: new Date (),
      };
      //   console.log(resource);
      let percent =
        resource.helpful_votes.length /
        (resource.helpful_votes.length + resource.unhelpful_votes.length);
      console.log (percent);
      resourceToken.helpfulness = percent;
      let pushString = {
        'interaction_tokens.created_important_dates': resourceToken,
      };
      let pullString = {
        'interaction_tokens.created_important_dates': {_id: resource._id},
      };
      switch (resource.collection) {
        case 'assignments':
          resourceToken.tokens = Math.ceil (percent * 5);
          pushString = {
            'interaction_tokens.created_assignments': resourceToken,
          };
          pullString = {
            'interaction_tokens.created_assignments': {_id: resource._id},
          };
          break;
        case 'notes':
          resourceToken.tokens = Math.ceil (percent * 3);
          pushString = {'interaction_tokens.created_notes': resourceToken};
          pullString = {
            'interaction_tokens.created_notes': {_id: resource._id},
          };
          break;
        case 'comments':
          resourceToken.tokens = Math.ceil (percent * 3);
          pushString = {'interaction_tokens.created_comments': resourceToken};
          pullString = {
            'interaction_tokens.created_comments': {_id: resource._id},
          };
          break;
        case 'posts':
          resourceToken.tokens = Math.ceil (percent * 5);
          pushString = {'interaction_tokens.created_posts': resourceToken};
          pullString = {
            'interaction_tokens.created_posts': {_id: resource._id},
          };
          break;
        case 'important-dates':
          resourceToken.tokens = Math.ceil (percent * 3);
          pushString = {
            'interaction_tokens.created_important_dates': resourceToken,
          };
          pullString = {
            'interaction_tokens.created_important_dates': {_id: resource._id},
          };
          break;
      }

      let user = await models['user'].findOneAndUpdate (
        {_id: resource.uploaded_by},
        {$pull: pullString}
      );
      user = await models['user'].findOneAndUpdate (
        {_id: resource.uploaded_by},
        {$push: pushString},
        {new: true}
      );
      let voteUser = await models['user'].findOneAndUpdate (
        {_id: resource.voted_by},
        {
          $pull: {'interaction_tokens.votes': {_id: resource._id}},
        }
      );

      voteUser = await models['user'].findOneAndUpdate (
        {_id: resource.voted_by},
        {
          $push: {'interaction_tokens.votes': voteToken},
        },
        {new: true}
      );
    } catch (e) {
      console.log (e);
    }
  });
};
