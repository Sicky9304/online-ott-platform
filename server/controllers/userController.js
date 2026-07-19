const User = require('../models/User');
const WatchHistory = require('../models/WatchHistory');
const { sendSuccess, sendError } = require('../utils/responseHandler');

exports.toggleWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user._id);

    const index = user.watchlist.indexOf(movieId);
    let inWatchlist = false;
    if (index > -1) {
      user.watchlist.splice(index, 1);
    } else {
      user.watchlist.push(movieId);
      inWatchlist = true;
    }

    await user.save();
    return sendSuccess(res, inWatchlist ? 'Added to Watchlist' : 'Removed from Watchlist', {
      inWatchlist,
      watchlist: user.watchlist
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

exports.getWatchHistory = async (req, res) => {
  try {
    const history = await WatchHistory.find({ user: req.user._id })
      .populate('movie')
      .sort({ lastWatchedAt: -1 });

    return sendSuccess(res, 'Watch history retrieved', { history });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};
