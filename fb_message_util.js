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
module.exports = util
