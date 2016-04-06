module.exports = {
  port: process.env.PORT || 3000,
  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/hackathon',
  secret: 'asdfasdfzcvzxcv',

  social:{
    twitter:{
      client_id: process.env.TWITTER_CLIENT_ID || 'Jw6gdI0TGsuFzGq9ClIoqWuHu',
      client_secret: process.env.TWITTER_CLIENT_SECRET || 'rQnElaPgiUUixe0viJ0dbd1M70RpO2a7P2R07pVEk4MPbxBxK7'
    },
    instagram:{
      client_id: process.env.INSTAGRAM_CLIENT_ID || 'b57a31bedd2f47449456558a53d127e3',
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET || 'ee3b706754584de19b31ca95c670caec'
    }
  }
}