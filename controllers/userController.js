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
            const user = await User.findOne({ _id: idParam }).select('-password');
            if (!user) return res.status(404).json({ param: 'id', msg: 'No user found with this id.' });


            /* Sending back the user with matching id */
            res.json({ user });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    }

}


module.exports = userController;