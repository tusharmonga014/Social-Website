import { POST_TYPES } from "../actions/postAction";
import { DeleteDataById, updateDataIfElementPresent, EditData } from "../actions/TYPES";

const initialState = {
    newPostModal: false,
    postUploading: false,
    postUploaded: false,
    homePosts: {
        posts: [],
        page: 1
    },
    detailedPosts: [],
    profilePostsArray: [],
    userMedia: []
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.NEW_POST_MODAL:
            return {
                ...state,
                postUploading: false,
                postUploaded: false,
                newPostModal: action.payload
            };
        case POST_TYPES.POST_UPLOADING:
            return {
                ...state,
                postUploading: action.payload
            };
        case POST_TYPES.POST_UPLOADED:
            return {
                ...state,
                postUploading: false,
                postUploaded: action.payload
            };
        case POST_TYPES.POSTS_LOADING:
            return {
                ...state,
                postsLoading: action.payload
            };
        case POST_TYPES.GET_POSTS:
            return {
                ...state,
                homePosts: { posts: [...state.homePosts.posts, ...action.payload.posts], result: action.payload.result, page: action.payload.page }
            };
        case POST_TYPES.GET_USER_POSTS:
            return {
                ...state,
                profilePostsArray: state.profilePostsArray.find(profilePosts => profilePosts._id === action.payload._id)
                    ? EditData(state.profilePostsArray, action.payload._id,
                        {
                            posts: [...state.profilePostsArray.find(profilePosts => profilePosts._id === action.payload._id).posts, ...action.payload.posts],
                            _id: action.payload._id, result: action.payload.result, page: action.payload.page
                        })
                    : EditData(state.profilePostsArray, action.payload.userId, action.payload)
            };
        case POST_TYPES.UPDATE_POST:
            return {
                ...state,
                homePosts: { ...state.homePosts, posts: updateDataIfElementPresent(state.homePosts.posts, action.payload._id, action.payload) },
                detailedPosts: updateDataIfElementPresent(state.detailedPosts, action.payload._id, action.payload),
                profilePostsArray: state.profilePostsArray.map(profilePosts => {
                    if (profilePosts._id === action.payload.user._id)
                        profilePosts.posts = updateDataIfElementPresent(profilePosts.posts, action.payload._id, action.payload);
                    return profilePosts;
                }),
                userMedia: state.userMedia.map(user => {
                    if (user._id === action.payload.user._id) {
                        user.media = user.media.filter(userMediaFile =>
                            userMediaFile.postId !== action.payload._id ||
                            action.payload.media.find(postMediaFile => postMediaFile.public_id === userMediaFile.public_id))
                    }
                    return user;
                })
            };
        case POST_TYPES.ON_EDIT:
            return {
                ...state,
                onEdit: action.payload
            };
        case POST_TYPES.REMOVE_POST:
            return {
                ...state,
                homePosts: { ...state.homePosts, posts: DeleteDataById(state.homePosts.posts, action.payload._id) },
                detailedPosts: DeleteDataById(state.detailedPosts, action.payload._id),
                profilePostsArray: state.profilePostsArray.map(profilePosts => {
                    if (profilePosts._id === action.payload.user._id)
                        profilePosts.posts = DeleteDataById(profilePosts.posts, action.payload._id);
                    return profilePosts;
                }),
                userMedia: state.userMedia.map(user => {
                    if (user._id === action.payload.user._id) {
                        user.media = user.media.filter(userMediaFile => userMediaFile.postId !== action.payload._id)
                    }
                    return user;
                })
            };
        case POST_TYPES.GET_POST:
            return {
                ...state,
                detailedPosts: [...state.detailedPosts, action.payload]
            };
        case POST_TYPES.GET_USER_MEDIA:
            return {
                ...state,
                userMedia: state.userMedia.find(user => user._id === action.payload._id)
                    ? EditData(state.userMedia, action.payload._id,
                        {
                            media: [...state.userMedia.find(user => user._id === action.payload._id).media, ...action.payload.media],
                            _id: action.payload._id, result: action.payload.result, page: action.payload.page
                        })
                    : EditData(state.userMedia, action.payload._id, action.payload)
            };
        default:
            return state;
    }
}

export default postReducer;