const User = require('../models/userModel');

const userController = {

    searchUser: async (req, res) => {

        try {

            /** Name query recieved in request. */
            const usernameQuery = req.query.username;
            if (!usernameQuery) return res.status(400).json({ param: 'username', msg: 'Name not provided.' });


            /** Users with matching username. */
            const users = await User.find({ username: { $regex: usernameQuery } })
                .limit(10).select('username userImage fullName');


            /* Sending t=back the users */
            res.json({ users });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    getUser: async (req, res) => {

        try {

            /** Id recieved in the request parameters. */
            const idParam = req.params.id;


            /** User with same id as recieved in the request. */
            const user = await User.findById(idParam).select('-password').populate('followers following', 'username fullName userImage');
            if (!user) return res.status(404).json({ param: 'id', msg: 'No user found with this id.' });


            /* Sending back the user with matching id */
            res.json({ user });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    follow: async (req, res) => {

        try {

            const alreadyFollowing = await User.findOne({ _id: req.user._id, following: req.params.id });
            if (!alreadyFollowing) {
                await User.updateOne({ _id: req.user._id }, { $push: { following: req.params.id } });
                await User.updateOne({ _id: req.params.id }, { $push: { followers: req.user._id } });
            }


            res.json({ msg: 'Successfully followed user.' });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    unfollow: async (req, res) => {

        try {

            const isFollowing = await User.findOne({ _id: req.user._id, following: req.params.id });
            if (!isFollowing) return res.status(400).json({ msg: 'User not following, cannot unfollow' });


            await User.updateOne({ _id: req.user._id }, { $pull: { following: req.params.id } });
            await User.updateOne({ _id: req.params.id }, { $pull: { followers: req.user._id } });


            res.json({ msg: 'Successfully Unfollowed user.' });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    suggestionsForUser: async (req, res) => {

        try {

            /** Users already being followed by user. */
            const usersAlreadyFollowed = [...req.user.following, req.user._id];
            /** Limit Query for number of users suggested. */
            const limit = req.query.suggestionsLimit || 10;


            /** Suggestions for user to be sent in response. */
            const suggestions = await User.aggregate([
                { $match: { _id: { $nin: usersAlreadyFollowed } } },
                { $sample: { size: Number(limit) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password");


            return res.json({
                suggestions,
                result: suggestions.length
            })


        } catch (err) {

            return res.status(500).json({ msg: err.message })
        }

    }

}


module.exports = userController;