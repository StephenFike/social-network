const { Thought, User } = require('../models');

const thougthController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
    },
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true, runValidators: true }
                )
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.status(400).json(err))
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.status(400).json(err))
    },
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return
                }
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err))
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbData => {
            if (!dbData) {
                return res.status(404).json({ message: "No thought found with this id!" });
            }
            return User.findOneAndUpdate(
                { _id: params.id },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
        })
        .then(dbData => {
            if (!dbData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json(dbData);
        })
        .catch(err => res.json(err));
    },
    deleteReaction({ params }, res) {
       Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true, runValidators: true })
                .then(dbData => res.json(dbData))
                .catch(err => res.json(err));
    }
};

module.exports = thougthController