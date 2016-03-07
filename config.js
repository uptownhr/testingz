module.exports = {
  port: process.env.PORT || 3000,
  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/hackathon',
  secret: 'asdfasdfzcvzxcv',

  social:{
    twitter:{
      client_id: process.env.TWITTER_CLIENT_ID || 'Jw6gdI0TGsuFzGq9ClIoqWuHu',
      client_secret: process.env.TIWTTER_CLIENT_SECRET || 'rQnElaPgiUUixe0viJ0dbd1M70RpO2a7P2R07pVEk4MPbxBxK7'
    }
  }
}