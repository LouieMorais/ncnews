const { selectAllTopics } = require('../models/topics.model')

exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
};