var express = require('express')
module.exports = function(billboard) {
    var songs = billboard.getAllSongs()
    var router = new express.Router()
    router.get('/test',(req,res)=>{
        res.send('thank you')
    })
    router.get('/allSongs',(req,res)=>{
      res.json(songs)
    })
    router.get('/song/:id',(req,res)=>{
      var id = req.params.id
      console.log(id)
      if(id>0 && id-1 < songs.length) {
          var song = songs[id-1]
          song.status = "success"
          res.json(song)
      }
      res.json({status:'failure'})
    })
    return router
}
