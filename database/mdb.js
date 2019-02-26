module.exports = mPool => {
  return {
    getCounts(user, countsField) {
      return mPool.collection('users')
        .findOne({userId: user.id})
        .then(results => results[countsField]);
    }
  }
}