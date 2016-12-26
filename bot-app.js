var botkit = require('botkit')
var config  = require('./config')
var port = process.env.port||config.port;
var fbUtil = require('./fb_message_util')
var Billboard = require('billboard-hot-100')
var numberRegex = /^\d*$/
Billboard.init().then((billboard)=>{
    var songs = billboard.getAllSongs()
    var controller = botkit.facebookbot({verify_token:config.fb_verfiy_token,access_token:config.fb_access_token})
    var bot = controller.spawn()
    controller.setupWebserver(port,(err,webserver)=>{
       if(err == null) {
          controller.createWebhookEndpoints(webserver,bot,()=>{
            console.log("bot is online")

          })
       }
    })
    controller.on('facebook_option',(bot,message)=>{
        bot.reply(message,"Hey there! I am Grizme bot. To display top songs till a certain number type top followed by the number  to display the details of a particular song please type song at <rank of the song> for example if you type song at 1 i will give you the details of number 1 song")
    })
    controller.hears(['hi','hello','Hello','Hi'],'message_received',(bot,message)=>{
      bot.reply(message,{sender_action:'typing_on'})
      console.log(message)
      bot.reply(message,"Hey there! I am Grizme bot. To display the list of top songs type top followed  to display the details of a particular song please type song at <rank of the song> for example if you type song at 1 i will give you the details of number 1 song")
      bot.reply(message,{sender_action:'typing_off'})
    })
    controller.hears(['list','top'],'message_received',(bot,message)=>{
       var txtMessage = message.text

       var limit = 30
       console.log(txtMessage)
       var numberStrings = txtMessage.split(" ").filter(str=>numberRegex.test(str))
       if(numberStrings.length >= 1) {
         limit = parseInt(numberStrings[0])
       }
       console.log(`limit is ${limit}`)
       if(limit<=30) {
           var reply = songs.filter((song,index)=>index<limit).map((song,index)=>(index+1)+". "+song.name).reduce((a,b)=>a+"\n"+b)
           bot.reply(message,reply)
       }
       else {
           var len = Math.floor(limit/4),prev=0
           for(var i=0;i<3;i++) {
             bot.reply(message,`songs from ${prev}-${prev+len}`)
             var reply = songs.filter((song,index)=>index>prev && index<prev+len).map((song,index)=>(index+1)+". "+song.name).reduce((a,b)=>a+"\n"+b)
             bot.reply(message,reply)
             prev = prev+len
           }
           if(limit-prev>0) {
              bot.reply(message,`songs from ${prev}-${limit}`)
              var reply = songs.filter((song,index)=>index>prev && index<limit).map((song,index)=>(index+1)+". "+song.name).reduce((a,b)=>a+"\n"+b)
              bot.reply(message,reply)
           }
       }

    })
    controller.hears(['song at','Song at'],'message_received',(bot,message)=>{
      var txtMessage = message.text
      console.log(txtMessage)
      var numberStrings = txtMessage.split(" ").filter(str=>numberRegex.test(str))
      if(numberStrings.length >= 1) {
          var index = parseInt(numberStrings[0])-1
          var song = songs[index]
          var artist = song.artist.replace(/\n/g,'').replace(/  /g,'')
          console.log(artist)
          bot.reply(message,`${artist} - ${song.name}`)
          fbUtil.sendAttachment(bot,message,song.name,artist,song.image)
      }
    })
}).catch((err)=>{
    console.log(err)
})
