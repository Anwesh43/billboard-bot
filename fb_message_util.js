var util = {}
util.sendAttachment = (bot,message,title,subtitle,imageSrc)=>{
  var attachment = {
       'type':'template',
       'payload':{
           'template_type':'generic',
           'elements':[
               {
                   'title':title,
                   'image_url':imageSrc,
                   'subtitle':subtitle,
               },
           ]
       }
   };
   bot.reply(message,{attachment})
}
util.getWelcomeMessage = () => {
   return "Hey there! I am Grizme bot. I display the top songs in billboard right now. To display top songs till a certain number type top followed by the number  to display the details of a particular song please type song at <rank of the song> for example if you type song at 1 i will give you the details of number 1 song"
}
module.exports = util
