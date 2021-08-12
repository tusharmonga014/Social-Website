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

    }

}


module.exports = userController;