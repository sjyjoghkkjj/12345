const mysql = require('mysql');
const { VK, MarketAttachment,Attachment, Keyboard } = require('vk-io');
const vk = new VK();
let user = new VK();
const keyboard = Keyboard;
const http = require('http'); 
const request = require("prequest");
const requests = require("request");
const rq = require("prequest");
const fs = require("fs");;  
const https = require('https'); 
const QuestionManager = require('vk-io-question');
const questionManager = new QuestionManager();
var randomstring = require("randomstring");
var Filter = require('bad-words'),
    filter = new Filter();
const { snippets } = vk;
const plural = require('plural-ru');
user.setOptions({
token: 'здесь ваш токен' 
});
var bot = {
    accounts: {},
    mysql: {
        db: null,
        connect: async function() {
                bot.mysql.db = mysql.createPool({
                    host: 'хост',
                    user: 'пользователь',
                    password: 'пароль',
                    database: 'название базы',
                    charset: 'utf8mb4_general_ci',
                    connectionLimit: 100
                });

				bot.mysql.db.getConnection(function(err, connection) {
if (err) { return console.error(`Ошибка с подключением к бд`, err); }
else { bot.mysql.load(); }
console.log(`База данных аккаунтов успешно подключена! `);

});
                },
                load: async function() {
                    bot.mysql.db.query('SELECT * FROM `accounts`', function(err, result) {
                        if (err) return console.log('[MYSQL] Ошибка при загрузке аккаунтов!', err);
                        if (!result || !result[0]) return;
                        var time = new Date();
                        for (var i = 0; i < result.length; i++) {
                            bot.accounts[result[i].vk] = result[i];
                        }
                    });
                },
                }
            }
            bot.mysql.connect();
var chat = {
                users: {},
                accounts: {},
                mysql: {
                    db: null,
                    connect: async function() {
                        chat.mysql.db = mysql.createPool({
                            host: 'хост',
                            user: 'пользователь',
                            password: 'пароль',
                            database: 'название базы',
                            charset: 'utf8mb4_general_ci',
                            connectionLimit: 100
                        });
            
                            chat.mysql.db.getConnection(function(err, connection) {
            if (err) { return console.error(`Ошибка с подключением к бд`, err); }
            else { chat.mysql.load(); }
            console.log(`База данных чатов успешно подключена! `);
            
            });
                            },
                            load: async function() {
                                chat.mysql.db.query('SELECT * FROM `users`', function(err, result) { //загрузка настроек чатов
                                    if (err) return console.log('[MYSQL] Ошибка при загрузке чатов!', err);
                                    if (!result || !result[0]) return;
                                    var time = new Date();
                                    for (var i = 0; i < result.length; i++) {
                                        chat.users[result[i].user_id] = result[i];
                                    }
                                });
                            },
                            }
                        }
                        chat.mysql.connect();
                        function getChatUser(user, chats){ 
                            return new Promise(function(resolve,reject){ 
                                chat.mysql.db.query('SELECT * FROM `users` WHERE `user_id` ="' + user +'" AND `chat_id` ="' + chats +'"', async function(err, chatik, fields){ 
                            if (err) console.log(err); 
                            if (!empty(chatik)) { 
                            const user_c = chatik[0]; 
                            resolve(user_c); 
                            }else{ 
                            resolve(); 
                            } 
                            }); 
                            }); 
                            }
vk.setOptions({ 
	token: 'токен группы', // 
	apiMode: 'parallel_selected',  
	pollingGroupId: 'id группы' // 
}); 

const { updates } = vk;
vk.updates.on(['chat_kick_user'], async (message) => { 
    if(message.senderId == message.payload.action.member_id)
    {
    bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` = '+ message.payload.action.member_id, async function (err,rows) {
    message.send(`@id${message.payload.action.member_id} (${rows[0].name} ${rows[0].surname}) вышел из чата.
    Возможно вы хотите применить одно из этих действий`,{ 
        keyboard:JSON.stringify( 
        { 
        "inline": true, 
        "buttons": [ 
        [{ 
            "action": { 
            "type": "text", 
            "payload": "{\"button\": \"" + message.payload.action.member_id + "\"}", 
            "label": `Кикнуть` 
            }, 
            "color": "secondary" 
        },
        { 
            "action": { 
            "type": "text", 
            "payload": "{\"button\": \"" + message.payload.action.member_id + "\"}", 
            "label": `Забанить` 
            }, 
            "color": "secondary" 
        }],
        [{ 
            "action": { 
            "type": "text", 
            "payload": "{\"button\": \"" + message.payload.action.member_id + "\"}", 
            "label": `Снять роль` 
            }, 
            "color": "secondary" 
        }]
        ] 
        }) 
        });
        
    });
}
});
vk.updates.on(['chat_invite_user'], async(message) => {	
    chat.mysql.db.query('SELECT * FROM `users` WHERE `user_id` = '+ message.payload.action.member_id +' AND `chat_id` = ' + message.chatId, async function (err,rows) {
    chat.mysql.db.query('SELECT * FROM `users` WHERE `user_id` = '+ message.senderId +' AND `chat_id` = ' + message.chatId, async function (err,row) {
        if(message.payload.action.member_id == -193270463)
        {
            return message.send(`Здарова.
            Сейчас у меня нет статуса администратора в беседе и я почти никак не могу с ней взаимодействовать.
            
            Подробнее о выдаче статуса администратора и регистрации беседы можно прочитать в статье:
            https://vk.com/@snezhikbot-add
            В меню ты найдешь все доступные команды:
            vk.com/@snezhikbot
            
            После выдачи админки обязательно напиши "Снежик обновить" в чат.
            ID чата для привязки: ${message.chatId}`)
        }
        if(row[0].rol > 1&&rows[0].ban != 0)
        {
        chat.mysql.db.query('UPDATE `users` SET `ban` = 0 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.payload.action.member_id +'"'); 
         return message.send(`У @id${message.payload.action.member_id } (пользователя) был бан до [∞], но он был автоматически снят из-за того, что его пригласил ${row[0].rol.toString().replace(/1/gi, "Участник").replace(/2/gi, "Модератор").replace(/3/gi, "Ст.Модератор").replace(/4/gi, "Администратор").replace(/5/gi, "Гл.Администратор").replace(/6/gi, "Создатель беседы")}.`)  
        }
        if(row[0].rol > 1&&rows[0].tban != 0)
        {
        chat.mysql.db.query('UPDATE `users` SET `tban` = 0 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.payload.action.member_id +'"'); 
         return message.send(`У @id${message.payload.action.member_id } (пользователя) был бан до [${unixStamp(Number(rows[0].tban))}], но он был автоматически снят из-за того, что его пригласил ${row[0].rol.toString().replace(/1/gi, "Участник").replace(/2/gi, "Модератор").replace(/3/gi, "Ст.Модератор").replace(/4/gi, "Администратор").replace(/5/gi, "Гл.Администратор").replace(/6/gi, "Создатель беседы")}.`)  
        }
        if(rows[0].tban > getUnix())
        {
        vk.api.call('messages.removeChatUser', { 
        chat_id: message.chatId, 
        user_id: message.payload.action.member_id 
        }); 
        return message.send(`Этот пользователь во временном бане!`)
        }
    if(rows[0].ban != 0)
    {
    vk.api.call('messages.removeChatUser', { 
    chat_id: message.chatId, 
    user_id: message.payload.action.member_id 
    }); 
    return message.send(`Этот пользователь в вечном бане.`)
    }
})
})
})
vk.updates.on(['chat_title_update'], async(message) => {
  await chat.mysql.db.query("UPDATE `chats` SET `name` = '"+ message.payload.action.text +"' WHERE `id` = " + message.chatId); 
})
//автодонат
const { stringify } = require('querystring');
let md5 = require('js-md5');

const express = require('express'); 
const app = express(); 

app.get('/payment', async (req, res) => { 
    res.send('Hello World')
a = { 
pay_id: req.query.pay_id, 
amount: req.query.amount, 
val: req.query.currency ? 'нет параметра' : req.query.currency, 
vkid: req.query.field1, 
desc: req.query.field2 
} 
bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` = ' + a.vkid, async function (err,pok) {
if(a.amount >= 1 && a.desc == 'currency'||a.desc == 'chat1'||a.desc == 'chat2'||a.desc == 'chat3'||a.desc == 'chat4'||a.desc == 'chat5') { 
bot.mysql.db.query("UPDATE `accounts` SET `donate` = `donate` + " + a.amount  + " WHERE `vk` = " + a.vkid);
vk.api.messages.send({ 
user_id: a.vkid, 
message: `@id${a.vkid} (${pok[0].name}) благодарим за пополнение донат счёта на ${a.amount}₽` 
}) 
vk.api.messages.send({ 
user_id: 217885070, 
message: `@id${a.vkid} (${pok[0].name}) пополнил донат счёта на ${a.amount}₽` 
}) 
}
res.send(JSON.stringify(a, null, "\t"))  
})
})
app.listen(82);
function donateLink(options) { 
	const url = `https://any-pay.org/merchant?`; 

    let payId = options.id;
    let Field1 = options.field1;
    let Field2 = options.field2;
	let secretKey = 'EVljISgO3PYGI5nEP09wjDpDN2SZlfy'; 
	let currency = 'RUB'; 
	let merchId = 5536; 

	let sign = md5(`${currency}:${options.amount}:${secretKey}:${merchId}:${payId}`); 

	const params = stringify({ 
		merchant_id: merchId, 
		pay_id: payId, 
        currency: currency, 
        field1: Field1,
        field2: Field2, 
		...options, 
		sign 
	}); 

	return url + params; 
}
//
/*function unmute() {
	chat.mysql.db.query('SELECT * FROM `users` WHERE `mute` != 0', async function(err,result){
	for(var i = 0; i < result.length; i++) {
        if(result[i].mute < getUnix()){
            const [user_info1] = await vk.api.users.get({
                user_id: result[i].user_id
                });
        chat.mysql.db.query('UPDATE `users` SET `mute` = `mute` = 0 WHERE `chat_id` ="' + result[i].chat_id +'" AND `user_id` ="' + result[i].user_id +'"');
        vk.api.messages.send({message: `С @id${result[i].user_id} (${user_info1.first_name} ${user_info1.last_name}) была снята блокировка сообщений.`, chat_id: result[i].chat_id})
        }
    }
	});
}
setInterval(unmute, 1000);*/
updates.use(async (context, next) => {
if(context.senderId == undefined) return
if(context.senderId < 1) return;
if (context.isOutbox || context.isGroup) return;
if(context.type === 'message' && context.isOutbox) { return; }
bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` = ' + context.senderId, async function (err,rows) {	
if(!bot.accounts[context.senderId]) {
vk.api.call('users.get', {
user_ids: context.senderId,
fields: 'name,lastname'
}).then(res => {
let user1 = res[0];
bot.accounts[context.senderId] = {
    id: (Object.keys(bot.accounts).length + 1)
    };
bot.mysql.db.query("INSERT IGNORE INTO `accounts` (`vk`,`name`,`surname`,`Status`,`uvedom`) VALUES ('" + context.senderId + "','" + user1.first_name + "','" + user1.last_name + "', '1','1')");
console.log('Зарегистрирован новый пользователь: ' + user1.first_name + " " + user1.last_name + ' его ID: ' + user1.id);
if(!context.isChat)
{
return context.send(`Привет, ${user1.first_name}!

Это интерактивный FAQ, где ты можешь получить ответы на частозадаваемые вопросы и посмотреть свою статистику.
Вот список команд:

1. Добавление в беседу
2. Список команд
3. Связаться с администратором

Для их использования используйте соответствующие им номера или кнопки.`,
{
keyboard:JSON.stringify(
{
"one_time": false,
"buttons": [
[{
"action": {
"type": "text",
"payload": "{\"button\": \"1\"}",
"label": "Добавление в беседу"
},
"color": "positive"
},{
"action": {
"type": "text",
"payload": "{\"button\": \"1\"}",
"label": "Список команд"
},
"color": "positive"
}],[{
"action": {
"type": "text",
"payload": "{\"button\": \"1\"}",
"label": "Связаться с поддержкой"
},
"color": "negative"
}]
]
})
})
}

}).catch((error) => {console.log('Ошибка: ',error); }); 
}
let ChatUser = await getChatUser(context.senderId, context.chatId).then((info) => { return info;});
if(empty(ChatUser)&&context.isChat){
let ogoblya = await vk.api.messages.getConversationMembers({ peer_id: context.peerId, fields: "id", group_id: 193270463}).then(function(response){ 
var c = response; 
if(c.items[0].member_id > 0) { 
if(c.items[0].is_owner == true){ 
 return c.items[0].member_id; 
} 
} 
});
let rol = 1
if(ogoblya == context.senderId)
{rol = 6}
bot.mysql.db.query('SELECT * FROM accounts WHERE id=LAST_INSERT_ID()', async function(err, last, fields){
chat.mysql.db.query("INSERT IGNORE INTO `users` (`id`,`chat_id`,`user_id`,`rol`,`lvl`,`ex_new`) VALUES ('" + Number(last[0]+1) + "','" + context.chatId + "','" + context.senderId + "','" + rol + "','1','15')");
})
}
if (rows == 0) return; 
if (/\[club193270463\|(.*)\]/i.test(context.text)) { context.text = context.text.replace(/\[club193270463\|(.*)\]/ig, '').trim(); }
 vk.updates.use(questionManager.middleware);
// НЕ УБИРАЙ ЧТОБЫ БОТ МОГ ЧИТАТЬ
try { await next(); } 
catch (error) {
    if(!bot.accounts[context.senderId]) return; 

}
const matchAllEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
if(matchAllEmoji.test(context.text)){ 
    await  chat.mysql.db.query('UPDATE `chats` SET `smile` = `smile` +  1 WHERE `id` ="' + context.chatId +'"');
} 
//настройки беседы
chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + context.chatId +'" AND `user_id` ="' + context.senderId +'"', async function(err, beseduser, fields){ 
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + context.chatId +'"', async function(err, besedsillki, fields){
        bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + context.senderId +'"', async function(err, chel, fields){ 
    if(context.isChat){   	
    if(beseduser[0].rol < besedsillki[0].ssilki){   
        let zaprets1 = context.text.toLowerCase();
        var zapret = /(&#4448;|вк бо т |вкботру|vkbot&#4448;ru|vkvot ru|vkbotru|vkbot|v k b o t . r u|в к бот|порно|botvk|ботвк|vkbot|кбот|bot vk|хентай|секс|пидр|трах|насилие|зоофил|бдсм|сирия|hentai|hentay|синий кит|самоубийство|террористы|слив|цп|cp|маленькие|малолетки|сучки|трах|ебля|изнасилование|блять|хуй|пошел нах|тварь|мразь|сучка|гандон|уебок|шлюх|паскуда|оргазм|девственницы|целки|рассовое|мелкие|малолетки|несовершеннолетние|ебля|хентай|sex|bdsm|ebl|trax|syka|shlux|инцест|iznas|мать|долбаеб|долбаёб|хуесос|сучка|сука|тварь|пездюк|хуй|шлюх|бог|сатана|мразь)/
        var filter0 = /(http(s)?:\/\/.)?(www\.)?[-a-z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}/
        var filter1 = /(?!http(s)?:\/\/)?(www\.)?[а-я0-9-_.]{1,256}\.(рф|срб|блог|бг|укр|рус|қаз|امارات.|مصر.|السعودية.)/
        var lol = filter0.test(zaprets1)
        var lol1 = filter1.test(zaprets1)
    if (filter0.test(zaprets1) == true || filter1.test(zaprets1) == true) { 
    if(beseduser[0].warn+1 >= 3){  
        chat.mysql.db.query('UPDATE `users` SET `warn` = 0 WHERE `chat_id` ="' + context.chatId +'" AND `user_id` ="' + context.senderId +'"'); 
        chat.mysql.db.query('UPDATE `users` SET `ban` = 1 WHERE `chat_id` ="' + context.chatId +'" AND `user_id` ="' + context.senderId +'"'); 
        vk.api.call("messages.removeChatUser", {chat_id: context.chatId, user_id: context.senderId }) 
        .catch((error) => {return context.send(`Error.`); 
        }); 
        return context.send(`Пользователь @id${beseduser[0].user_id} (${chel[0].name}) получил предупреждение 3/3 и был исключен из беседы`); 
        }else{ 
        chat.mysql.db.query('UPDATE `users` SET `warn` = `warn` + 1 WHERE `chat_id` ="' + context.chatId +'" AND `user_id` ="' + context.senderId +'"'); 
        return context.send(`Пользователь @id${beseduser[0].user_id} (${chel[0].name}) получил предупреждение ${beseduser[0].warn+1}/3.
        У @id${beseduser[0].user_id} (${chel[0].name}) теперь ⚠ [${beseduser[0].warn+1}/3] предупреждений.`); 
        } 
    }
}
}
})
})
})
//    
if(context.text){   
await bot.mysql.db.query("UPDATE `accounts` SET `sms` = `sms` + 1 WHERE `vk` = " + context.senderId);
if(context.isChat)
{
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + context.chatId +'" AND `user_id` ="' + context.senderId +'"', async function(err, user22, fields){
        if(user22[0].mute != 0)
        {
            vk.api.call('messages.removeChatUser', { 
                chat_id: context.chatId, 
                user_id: context.senderId
                });    
                await chat.mysql.db.query('UPDATE `users` SET `mute` = 0 WHERE `chat_id` ="' + context.chatId +'" AND `user_id` ="' + context.senderId +'"');
                return context.send(`У @id${context.senderId} (пользователя) была блокировка сообщений, до ${unixStamp(Number(user22[0].mute))}`)
        }
    if(context.hasReplyMessage||context.forwards[0]) {await  chat.mysql.db.query('UPDATE `chats` SET `reply` = `reply` +  1 WHERE `id` ="' + context.chatId +'"');}
    await  chat.mysql.db.query('UPDATE `users` SET `sms` = `sms` +  1 WHERE `chat_id` ="' + context.chatId +'" AND `user_id` ="' + context.senderId +'"');
    await chat.mysql.db.query('UPDATE `users` SET `ex` = `ex` +  1 WHERE `user_id` ="' + context.senderId +'" AND `chat_id` ="' + context.chatId +'"');
    if(user22[0].ex+1 == user22[0].ex_new){
        await chat.mysql.db.query('UPDATE `users` SET `ex_new` = `ex_new` +  15 WHERE `user_id` ="' + context.senderId +'" AND `chat_id` ="' + context.chatId +'"');
        await chat.mysql.db.query('UPDATE `users` SET `ex` = 0 WHERE `user_id` ="' + context.senderId +'" AND `chat_id` ="' + context.chatId +'"');
        await chat.mysql.db.query('UPDATE `users` SET `lvl` = `lvl` +  1 WHERE `user_id` ="' + context.senderId +'" AND `chat_id` ="' + context.chatId +'"');
    }
    await chat.mysql.db.query('UPDATE `users` SET `simvol` = `simvol` +  "' + context.text.toLowerCase().length +'" WHERE `user_id` ="' + context.senderId +'" AND `chat_id` ="' + context.chatId +'"');
    await  chat.mysql.db.query('UPDATE `chats` SET `sms` = `sms` +  1 WHERE `id` ="' + context.chatId +'"');
    await  chat.mysql.db.query('UPDATE `chats` SET `simvol` = `simvol` +  "' + context.text.toLowerCase().length +'" WHERE `id` ="' + context.chatId +'"');
})
}
}  
if(!context.isChat&&context.attachments[0]) {
    if(context.payload.attachments[0].market.title == "«Золотая беседа» на 1 месяц") 
    {
        let don_currency = donateLink({ 
            amount: 35, 
           field1: context.senderId, 
           field2: 'chat1', 
           id: 2 
           }); 
           let currencyy = await vk.api.utils.getShortLink({ url: don_currency }); 
        return context.send(`«Золотая беседа» на 1 месяц\nСтоимость товара: ${context.payload.attachments[0].market.price.text}\n🔗 Ссылка для оплаты ${currencyy.short_url}`)
    }
    if(context.payload.attachments[0].market.title == "«Золотая беседа» на 3 месяца")
    {
        let don_currency = donateLink({ 
            amount: 90, 
           field1: context.senderId, 
           field2: 'chat2', 
           id: 2 
           }); 
           let currencyy = await vk.api.utils.getShortLink({ url: don_currency }); 
        return context.send(`«Золотая беседа» на 3 месяца\nСтоимость товара: ${context.payload.attachments[0].market.price.text}\n🔗 Ссылка для оплаты ${currencyy.short_url}`)
    }
    if(context.payload.attachments[0].market.title == "«Золотая беседа» на пол года") 
    {
        let don_currency = donateLink({ 
            amount: 165, 
           field1: context.senderId, 
           field2: 'chat3', 
           id: 2 
           }); 
           let currencyy = await vk.api.utils.getShortLink({ url: don_currency }); 
        return context.send(`«Золотая беседа» на пол года\nСтоимость товара: ${context.payload.attachments[0].market.price.text}\n🔗 Ссылка для оплаты ${currencyy.short_url}`)
    }
    if(context.payload.attachments[0].market.title == "«Золотая беседа» на 1 год") 
    {
        let don_currency = donateLink({ 
            amount: 300, 
           field1: context.senderId, 
           field2: 'chat4', 
           id: 2 
           }); 
           let currencyy = await vk.api.utils.getShortLink({ url: don_currency }); 
        return context.send(`«Золотая беседа» на 1 год\nСтоимость товара: ${context.payload.attachments[0].market.price.text}\n🔗 Ссылка для оплаты ${currencyy.short_url}`)
    }
    if(context.payload.attachments[0].market.title == "«Золотая беседа» на вечность") 
    {
        let don_currency = donateLink({ 
            amount: 666, 
           field1: context.senderId, 
           field2: 'chat5', 
           id: 2 
           }); 
           let currencyy = await vk.api.utils.getShortLink({ url: don_currency }); 
        return context.send(`«Золотая беседа» на вечность\nСтоимость товара: ${context.payload.attachments[0].market.price.text}\n🔗 Ссылка для оплаты ${currencyy.short_url}`)
    }
}
if(context.attachments[0]&&context.isChat) {
if(context.attachments[0].productId) {await  chat.mysql.db.query('UPDATE `chats` SET `stickers` = `stickers` +  1 WHERE `id` ="' + context.chatId +'"');}
if(context.payload.attachments[0].photo) {await  chat.mysql.db.query('UPDATE `chats` SET `photos` = `photos` +  1 WHERE `id` ="' + context.chatId +'"');}
if(context.payload.attachments[0].video) {await  chat.mysql.db.query('UPDATE `chats` SET `video` = `video` +  1 WHERE `id` ="' + context.chatId +'"');}
if(context.payload.attachments[0].audio) {await  chat.mysql.db.query('UPDATE `chats` SET `audio` = `audio` +  1 WHERE `id` ="' + context.chatId +'"');}
if(context.payload.attachments[0].doc) {await  chat.mysql.db.query('UPDATE `chats` SET `doc` = `doc` +  1 WHERE `id` ="' + context.chatId +'"');}
if(context.payload.attachments[0].wall) {await  chat.mysql.db.query('UPDATE `chats` SET `post` = `post` +  1 WHERE `id` ="' + context.chatId +'"');}
}               
})
})
setInterval(function () { 
    user.api.status.set({ 
    text: `Чат-менеджер Онлайн ✔\n⌚${data()} ${time()}`});
    }, 60000);
vk.updates.hear(/^(?:добавление в беседу|!добавление в беседу)$/i, async (message) => {
    if(!message.isChat) return message.send(`Процесс добавления бота в беседу подробно описан в этой статье:
    https://vk.com/@snezhikbot-add
    `)
}); 
vk.updates.hear(/^(?:донат|!донат)\s(.*)?/i, async message => {
   let don_currency = donateLink({ 
    amount: message.$match[1], 
   field1: message.senderId, 
   field2: 'currency', 
   id: 2 
   }); 
   let currencyy = await vk.api.utils.getShortLink({ url: don_currency }); 
   if(!message.$match[1]||!Number(message.$match[1])) return message.send(`Правильное использование - Донат <сумма>`) 
   if(message.$match[1] < 1) return message.send(`❗ Минимальная сумма пополнения - 1₽`) 
   return message.send(`🔗 Ссылка для оплаты ${currencyy.short_url}\n💸 Сумма для оплаты: ${message.$match[1]}₽`) 
   });

   vk.updates.hear(/^(?:золотая беседа|!золотая беседа)/i, async (message) => {
    bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + message.senderId +'"', async function(err, rows, fields){ 
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `owner` ="' + message.senderId +'"', async function(err, besed, fields){ 
        if(besed == 0) return message.send(`У вас нет бесед.`)
        if(rows[0].donate < 35) return message.send(`У вас недостаточно средств.`)
        if(!message.isChat) {
        const nomer = await message.question(`Введите номер беседы, которую хотите сделать золотой:
        ${besed.map((x) => `👑 | [#${x.id}]: ${x.name} (${x.lvl} ур.)`).join("\n")}`)
        chat.mysql.db.query('SELECT * FROM `chats` WHERE `owner` ="' + message.senderId +'" AND `id` ="' + nomer.text +'"', async function(err, result, fields){ 
        if(result == 0) return message.send(`У вас нет данной беседы!`)
        chat.mysql.db.query('UPDATE `chats` SET `gold` = 1 WHERE `id` ="' + nomer.text +'"'); 
        return message.send(`Теперь у беседы "${result[0].name}"\nСтатус: Золотой`)
        });
         }
    });
});
}); 

vk.updates.hear(/^(?:коронавирус|!коронавирус)/i, async (message) => {
    rq("https://api.thevirustracker.com/free-api?countryTotal=RU")
    .then((res) => {
    message.send(`
    Статистика Коронавируса в России
    Всего заражённых: ${utils.sp(res.countrydata[0].total_cases)}
    Всего умерших: ${utils.sp(res.countrydata[0].total_deaths)}
    Всего выздоровило: ${utils.sp(res.countrydata[0].total_recovered)}
    ==================================
    Новых заражённых за сегодня: ${utils.sp(res.countrydata[0].total_new_cases_today)}
    Новых умерших за сегодня: ${utils.sp(res.countrydata[0].total_new_deaths_today)}

    Уровень опасности: ${utils.sp(res.countrydata[0].total_danger_rank)}
    `)
    });
});
vk.updates.hear(/^(?:погода|weather|!погода|!weather)/i, async (message, bot) => {
    let args = message.text.match(/^(?:погода|weather)\s?(.*)/i);
    if(args[1].toLowerCase() == "") return message.send(nope)
    rq("http://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(args[1]) + "&appid=fe198ba65970ed3877578f728f33e0f9&units=metric")
    .then((res) => {
    let Utils = {
    filter: (text) => { 
    text = text.replace(/^(RU)/i, 'Россия')
    text = text.replace(/^(UA)/i, 'Украина')
    text = text.replace(/^(BY)/i, 'Беларусь')
    text = text.replace(/^(KZ)/i, 'Казахстан')
    text = text.replace(/^(AE)/i, 'Объединенные Арабские Эмираты')
    return text;
    }};
    function TempTo () {
    if(res.main.temp < -10) return 'очень холодно'
    else if(res.main.temp < -5) return 'холодно'
    else if(res.main.temp < 5) return 'холодновато'
    else if(res.main.temp < 20) return 'комфортно'
    else if(res.main.temp < 25) return 'тепло'
    else if(res.main.temp < 30) return 'жарко'
    else if(res.main.temp < 50) return 'Очень жарко'
    };
    function Timer () {
    let now = new Date(res.dt*1000).getHours();
    if(now > 18) return '🌆'
    else if(now > 22) return '🌃'
    else if(now > 0) return '🌃'
    else if(now < 6) return '🌅'
    else if(now < 12) return '🏞'
    };
    var sunrise = new Date(res.sys.sunrise*1000);
    var sunset = new Date(res.sys.sunset*1000);
    function sunmin () {
    if(sunrise.getMinutes() < 10) "0" + sunrise.getMinutes();
    return sunset.getMinutes();
    };
    function sunsmin () {
    if(sunset.getMinutes() < 10) "0" + sunset.getMinutes();
    return sunset.getMinutes();
    };
    function daterh () {
    if(date.getHours() < 10) "0" + date.getHours();
    return date.getHours()
    };
    function daterm () {
    if(date.getMinutes() < 10) "0" + date.getMinutes();
    return date.getMinutes();
    };
    var date = new Date(res.dt*1000);
    return message.reply(`${Timer()} ${res.name}, ${Utils.filter(res.sys.country)}
    
    ➖ Сейчас там ${TempTo()}: ${res.main.temp}°С
    ➖ Рассвет: ${sunrise.getHours()}:${sunmin()}
    ➖ Закат: ${sunset.getHours()}:${sunsmin()}
    ➖ Скорость ветра: ${res.wind.speed} м/с`)})
    });
vk.updates.hear(/^(?:статистика|stats|!статистика|!stats)$/i, async (message) => {
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, rows, fields){ 
    if (!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`);
    if(message.isChat&&rows[0].gold == 1&&rows[0].gold_time > getUnix()) return message.send(`
    👑 Золотая беседа
    📧 Сообщений: ${utils.rn(rows[0].sms)}
    🔣 Символов: ${utils.rn(rows[0].simvol)}
    🎵 Голосовых: ${utils.rn(rows[0].golos)}
    📩 Пересланных: ${utils.rn(rows[0].reply)}
    📷 Фото: ${utils.rn(rows[0].photos)}
    📹 Видео: ${utils.rn(rows[0].video)}
    🎧 Аудио: ${utils.rn(rows[0].audio)}
    📑 Документов: ${utils.rn(rows[0].doc)}
    📣 Постов: ${utils.rn(rows[0].post)}
    💩 Стикеров: ${utils.rn(rows[0].stickers)}
    ❗ Команд: ${utils.rn(rows[0].command)}
    🤣 Смайлов: ${utils.rn(rows[0].smile)}
    👺 Сообщений с матом: ${utils.rn(rows[0].mat)}
    `)
    if (!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`);
    if(message.isChat&&rows[0].gold == 0&&rows[0].gold_time < getUnix()) return message.send(`
    📧 Сообщений: ${utils.rn(rows[0].sms)}
    🔣 Символов: ${utils.rn(rows[0].simvol)}
    🎵 Голосовых: ${utils.rn(rows[0].golos)}
    📩 Пересланных: ${utils.rn(rows[0].reply)}
    📷 Фото: ${utils.rn(rows[0].photos)}
    📹 Видео: ${utils.rn(rows[0].video)}
    🎧 Аудио: ${utils.rn(rows[0].audio)}
    📑 Документов: ${utils.rn(rows[0].doc)}
    📣 Постов: ${utils.rn(rows[0].post)}
    💩 Стикеров: ${utils.rn(rows[0].stickers)}
    ❗ Команд: ${utils.rn(rows[0].command)}
    🤣 Смайлов: ${utils.rn(rows[0].smile)}
    👺 Сообщений с матом: ${utils.rn(rows[0].mat)}
    `)
});  
});
vk.updates.hear(/^(?:моя стата|моястата|моя статистика|моястатистика|!моя стата|!моястата|!моя статистика|!моястатистика)$/i, async (message) => {
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` =' + message.chatId +' AND `user_id` =' + message.senderId +' ORDER BY `users`.`sms` DESC', async function(err, top, fields){
    if (!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`);
    for (i=0;i<top.length;i++) {
    if(message.isChat&&message.senderId == top[i].user_id) return message.send(`
    📧 Сообщений: ${utils.rn(rows[0].sms)}
    🔣 Символов: ${utils.rn(rows[0].simvol)}
    🏆 Рейтинг активности: ${i+1}
    💡 LVL: ${rows[0].lvl} (${rows[0].ex}/${rows[0].ex_new} EXP) 
    ⚠ Предупреждений: ${rows[0].warn} / 3
    `)
}
});  
});
});
vk.updates.hear(/^(?:кикнуть)\s?([^]+)?/i, async (message) => {	
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
    if(rows[0].rol < 2) return message.send(`Недостаточно прав для того, чтобы исключить этого пользователя.`);
    let idperca = Number(message.messagePayload.button);
    vk.api.call('messages.removeChatUser', { 
       chat_id: message.chatId, 
       user_id: idperca
       }); 
    });
    });
     vk.updates.hear(/^(?:снять роль)\s?([^]+)?/i, async (message) => {	
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
         if(rows[0].rol < 2) return message.send(`Недостаточно прав для того, чтобы удалить этого пользователя из беседы.`);
         if(message.messagePayload.button == 0) return;
         let idperca = Number(message.messagePayload.button);
         const [user_info] = await vk.api.users.get({
            user_id: idperca,
            name_case: 'gen',
            fields: 'first_name,last_name'
            });
        chat.mysql.db.query('UPDATE `users` SET `rol` = 1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + idperca +'"'); 
         return message.send(`Теперь у @id${idperca} (${user_info.first_name} ${user_info.last_name}) роль [участник]. `)
         });
         });
vk.updates.hear(/^(?:забанить)\s?([^]+)?/i, async (message) => {	
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
        bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + Number(message.messagePayload.button) +'"', async function(err, chel, fields){ 
    if(rows[0].rol < 2) return message.send(`Недостаточно прав для того, чтобы исключить этого пользователя.`);
    if(message.messagePayload.button == 0) return;
    let idperca = Number(message.messagePayload.button);
    chat.mysql.db.query('UPDATE `users` SET `ban` = 1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + idperca +'"'); 
    const [user_info] = await vk.api.users.get({
            user_id: message.senderId,
            name_case: 'ins',
            fields: 'first_name,last_name'
            });
            message.send(`@id${idperca} (Пользователь) был исключен из беседы навечно.`)
            if(chel[0].uvedom == 1)
            {
            vk.api.messages.getConversationsById({
                peer_ids: 2000000000 + message.chatId
                }).then(res => {
             
            vk.api.call("messages.send", {
            user_id: idperca,
            message: `😔 Получен бан в чате «${res.items[0].chat_settings.title}» 
            ⏳ Начало: ${data()} ${time()} GMT+3 
            ⌛ Окончание: бессрочный (никогда) 
            👑 Бан выдан @id${message.senderId} (${user_info.first_name} ${user_info.last_name}).`,
            random_id: 0
        })
    });
        }
    });
    });
});
vk.updates.hear(/^(?:рассылка)\s(.*)$/i, async (context) => {
    bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + context.senderId +'"', async function(err, rows, fields){
    if(rows[0].status < 3) return;
    let chet = 0;
        bot.mysql.db.query('SELECT * FROM `accounts`', async function(err,result){
        if(err) return console.log('Ошибка при загрузке аккаунтов!', err), context.send('[MYSQL] Ошибка при загрузке аккаунтов!', err);
        for(var i = 0; i < result.length; i++) {
        bot.accounts[result[i].vk] = result[i];
        }
        for(i in bot.accounts){
        if(bot.accounts[i].uvedom == 1){
        await vk.api.messages.send({user_id: bot.accounts[i].vk, message: context.$match[1], random_id: 0 });
        chet++
        }
        }  
        return context.send('В рассылке было человек ' + chet);
        });
    });
    });
vk.updates.hear(/^(?:онлайн)$/i, async (message, bot) => {
    if (!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`);
    vk.api.messages.getConversationMembers({
    peer_id: message.peerId,
    fields: "online"
    }).then(async function (response) {
    let text = ` В беседе участников в сети:\n\n`;
    await response.profiles.map(e => {
    if(e.id < 1) return;
    if(e.online != 0)
    {
    text += `*id${e.id} (${e.first_name} ${e.last_name})`;
    
    if(e.online_mobile == "1") text += " | 📱";
    else text += " | 💻";
    
    text += "\n";
    }
    })
    return message.send(text)
    })
    }); 
vk.updates.hear(/^(?:🔕 Отключить уведомления)$/i, async (message) => {
    bot.mysql.db.query('UPDATE `accounts` SET `uvedom` = 0 WHERE `vk` ="' + message.senderId +'"'); 
    if(!message.isChat) return message.send(`Уведомления бота отключены.
    `)
}); 
vk.updates.hear(/^(?:🔔 Включить уведомления)$/i, async (message) => {
    bot.mysql.db.query('UPDATE `accounts` SET `uvedom` = 1 WHERE `vk` ="' + message.senderId +'"'); 
    if(!message.isChat) return message.send(`Уведомления бота включены.
    `)
});  
vk.updates.hear(/^(?:Связаться с поддержкой)$/i, async (message) => {
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `owner` ="' + message.senderId +'"', async function(err, besed, fields){ 
    if(!message.isChat) return message.send(`Вы всегда можете связаться с администратором, используя ЛС: vk.com/razrab_maks
    `)
});
}); 
vk.updates.hear(/^(?:Все мои беседы)$/i, async (message) => {
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `owner` ="' + message.senderId +'"', async function(err, besed, fields){ 
    if(besed == 0) return message.send(`У вас нет бесед.`)
    if(!message.isChat) return message.send(`Беседы, в которых вы создатель:
    ${besed.map((x) => `👑 | [#${x.id}]: ${x.name} (${x.lvl} ур.)`).join("\n")}
    `)
});
});
updates.hear(/^(?:профиль|проф|!профиль|!проф)$/i, async (message) => {
    if(!message.isChat)
    {
    bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + message.senderId +'"', async function(err, rows, fields){ 
    if (err) console.log(err);
    let ctx = message;
    const Canvas = require('canvas');
    const { createCanvas, loadImage } = require('canvas');
    const canvas = createCanvas(323,282);
    const Image = Canvas.Image;
    
    const ctxx = canvas.getContext('2d');
    const img = new Image();
    let fotka = 'prof'
    if(rows[0].uvedom == 0) { fotka = 'prof'} 
    if(rows[0].uvedom == 1) { fotka = 'prof2'} 
    img.src = `./photo/${fotka}.png`;
    ctxx.drawImage(img, 0, 0);
    const [user_info] = await vk.api.users.get({
    user_id: ctx.senderId
    });
    //шрифт 
    const { 
	registerFont 
}    = require('canvas') 
    registerFont('./fonts/123.ttf', { 
    family: 'Regular'
    })
    if(rows[0].uvedom == 1){uved = `🔕 Отключить уведомления`, uvedcolor = "negative"}
    if(rows[0].uvedom == 0){uved = `🔔 Включить уведомления`, uvedcolor = "positive"}
    //Игрок
    const [user] = await vk.api.users.get({ user_id: ctx.senderId, fields: 'last_name, first_name' });
    ctxx.font = '13px Regular';
    ctxx.fillStyle = '#ffffff';
    strokeStyle = '#ffffff'
    ctxx.fillText(`${rows[0].name} ${rows[0].surname}
    `,27, 68);
    ctxx.fillText(`${utils.rn(rows[0].sms)}
    `,172, 89);
    ctxx.fillText(`127.0.0.1
    `,166, 128);
    ctxx.fillText(`${utils.st(rows[0].donate)}₽
    `,133, 250);
    ctxx.fillText(`${rows[0].Status.toString().replace(/1/gi, "Отсуствует").replace(/2/gi, "Поддержка").replace(/3/gi, "Администратор")}
    `,103, 209);
    const foto = await vk.upload.messagePhoto({ 
	source: canvas.toBuffer() 
    });
    message.send({ attachment: foto })
return message.send(`‌‌‍‍
`,
    {
    keyboard:JSON.stringify( 
    { 
    "inline": true, 
    "buttons": [ 
    [{ 
    "action": { 
    "type": "text", 
    "payload": "{\"button\": \"" + message.senderId + "\"}", 
    "label": uved 
    }, 
    "color": uvedcolor 
    }],
    [{ 
        "action": { 
        "type": "text", 
        "payload": "{\"button\": \"" + message.senderId + "\"}", 
        "label": `Все мои беседы` 
        }, 
        "color": "secondary" 
    }]
    ] 
    }) 
    })
    });
}
    });
vk.updates.hear(/^(?:олдпроф)$/i, async (message) => {
    bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + message.senderId +'"', async function(err, rows, fields){ 
        let uved = 0
        if(rows[0].uvedom == 1){uved = `🔕 Отключить уведомления`, uvedcolor = "negative"}
        if(rows[0].uvedom == 0){uved = `🔔 Включить уведомления`, uvedcolor = "positive"}
    if(!message.isChat) return message.send(`
    Профиль пользователя @id${message.senderId} (${rows[0].name} ${rows[0].surname})
📩 | Всего сообщений: ${rows[0].sms}
🖥 | CallBack сервер: Отключен
🔔 | Оповещения: ${rows[0].uvedom.toString().replace(/0/gi, "Отключены").replace(/1/gi, "Включены")}
📝 | Статус: ${rows[0].Status.toString().replace(/1/gi, "Отсуствует").replace(/2/gi, "Поддержка").replace(/3/gi, "Администратор")}
💴 | Донат-счёт: ${utils.sp(rows[0].donate)}₽
    `,{ 
        keyboard:JSON.stringify( 
        { 
        "inline": true, 
        "buttons": [ 
        [{ 
        "action": { 
        "type": "text", 
        "payload": "{\"button\": \"" + message.senderId + "\"}", 
        "label": uved 
        }, 
        "color": uvedcolor 
        }],
        [{ 
            "action": { 
            "type": "text", 
            "payload": "{\"button\": \"" + message.senderId + "\"}", 
            "label": `Все мои беседы` 
            }, 
            "color": "secondary" 
        }]
        ] 
        }) 
        });
    }); 
}); 
vk.updates.hear(/^(?:выдать статус|выдать голд|статус выдать|голд выдать)\s(.*)\s([0-9]+)\s([А-я]+)?$/i, async (message) => { 
    if(message.senderId != 217885070) return; 
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.$match[1] +'"', async function(err, rows, fields){
    let time = 0
    if(/сек/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (1000*message.$match[2])}
    if(/мин/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (60000*message.$match[2])}
    if(/час/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (3600000*message.$match[2])}
    if(/день|дней/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (86400000*message.$match[2])}
    if(/нед/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (604800000*message.$match[2])}
    if(/мес/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (2592000000*message.$match[2])}
    if(/год|лет/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (31536000000*message.$match[2])}
chat.mysql.db.query('UPDATE `chats` SET `gold` = 1  WHERE `id` ="' + message.$match[1] +'"');
chat.mysql.db.query('UPDATE `chats` SET `gold_time` = "'+ time +'"  WHERE `id` ="' + message.$match[1] +'"');  
return message.send(`«Золотой статус» беседе [ID: ${message.$match[1]}] «${rows[0].name}» до ${unixStamp(Number(time))} успешно выдан.`) 
}); 
}); 
vk.updates.hear(/^(?:чат ид|!чат ид|cid|!cid)$/i, async (message) => {
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    message.send(`${message.chatId}`);
});
updates.hear(/^(?:ссылки|!ссылки)\s?([А-я]+)?/i, async (message) => {
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){
    let status = 0
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, besed, fields){
    if(rows[0].rol < 6) return message.reply(`Недостаточно прав для того, чтобы изменять настройки беседы.`); 
    if(!/участ|модер|стмодер|адм|гладм|созд/i.test(message.$match[1])) return message.send(`Вы указали несуществующую роль.`)
    if(/участ/i.test(message.$match[1].toLowerCase())) {status = 1}
    if(/модер/i.test(message.$match[1].toLowerCase())) {status = 2}
    if(/стмодер/i.test(message.$match[1].toLowerCase())) {status = 3}
    if(/адм/i.test(message.$match[1].toLowerCase())) {status = 4}
    if(/гладм/i.test(message.$match[1].toLowerCase())) {status = 5}
    if(/созд/i.test(message.$match[1].toLowerCase())) {status = 6}
    chat.mysql.db.query("UPDATE `chats` SET `ssilki` = "+ status +" WHERE `id` = " + message.chatId); 
    return message.send(`Теперь можно использовать ссылки в беседе от роли [${message.$match[1]}].`);
});
});
});
vk.updates.hear(/^(?:заметка новая|новая заметка|!заметка новая|!новая заметка)\s(.*)$/i, async (message) => {
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, rows, fields){
        chat.mysql.db.query('SELECT * FROM `zametki` WHERE id=LAST_INSERT_ID()', async function(err, last, fields){
            chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, user, fields){ 
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    if(user[0].rol < 6) return message.reply(`Недостаточно прав для применения этой команды.`);  
    chat.mysql.db.query('SELECT * FROM `zametki` WHERE `name` ="' + message.$match[1] +'" AND `chat_id` ="' + message.chatId +'"', async function(err, row, fields){
    if(row != 0) return message.send(`Данное название заметки уже занято «${message.$match[1]}».`);
    chat.mysql.db.query("INSERT IGNORE INTO `zametki` (`id`,`chat_id`,`text`,`name`,`rol`,`owner`,`data`) VALUES ('"+ last[0]+1 + "'," + message.chatId + ",'"+ message.forwards[0].text +"','"+ message.$match[1] +"','1','"+ message.forwards[0].senderId +"','"+ getUnix() +"')")
    return message.send(`✏ Вы успешно добавили это сообщение в качестве заметки «${message.$match[1]}»`)
});
})
});
});
});
vk.updates.hear(/^(?:заметки|!заметки)\s?(.*)?/i, (message) => { 
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, chel, fields){ 
        if(chel[0].rol < 2) return message.send(`Недостаточно прав для применения этой команды.`)
        chat.mysql.db.query('SELECT * FROM `zametki` WHERE `chat_id` ="' + message.chatId +'"', async function(err, zametki, fields){
            chat.mysql.db.query('SELECT COUNT(*) AS count FROM zametki WHERE `chat_id` ="' + message.chatId +'"', async function(err, vsegozam, fields){
            if (zametki == 0) return message.send(`В данной беседе еще нет установленных заметок.`);
            if(zametki[0].command != 0) return message.send(`Заметки в этой беседе (${vsegozam[0].count}/∞)\n${zametki.map((x) => `✏ Заметка «${x.name}» для [${x.rol.toString().replace(/1/gi, "Участников").replace(/2/gi, "Модераторов").replace(/3/gi, "Ст.Модераторов").replace(/4/gi, "Администраторов").replace(/5/gi, "Гл.Администраторов").replace(/6/gi, "Создателя беседы")}] от ${unixStamp(Number(x.data))} («${x.command}»)`).join("\n")}`);
            return message.send(`Заметки в этой беседе (${vsegozam[0].count}/∞)\n${zametki.map((x) => `✏ Заметка «${x.name}» для [${x.rol.toString().replace(/1/gi, "Участников").replace(/2/gi, "Модераторов").replace(/3/gi, "Ст.Модераторов").replace(/4/gi, "Администраторов").replace(/5/gi, "Гл.Администраторов").replace(/6/gi, "Создателя беседы")}] от ${unixStamp(Number(x.data))}`).join("\n")}`);
            
            });
        });
    });
});
vk.updates.hear(/^(?:заметка|!заметка)\s?(.*)?/i, (message) => {
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, chel, fields){ 
    chat.mysql.db.query('SELECT * FROM `zametki` WHERE `chat_id` ="' + message.chatId +'" AND `name` ="' + message.$match[1] +'"', async function(err, zametka, fields){
    if(chel[0].rol < 6) return message.reply(`Недостаточно прав для применения этой команды.`); 
    if(zametka == 0) return message.send(`Такой заметки не существует.`)
    if(chel[0].rol < zametka[0].rol) return message.send(`Недостаточно прав для просмотра этой заметки.`)
    const [user_info] = await vk.api.users.get({
        user_id: zametka[0].owner
        });
    return message.send(`
    Заметка «${message.$match[1]}»
    Сообщение от: @id${zametka[0].owner} (${user_info.first_name} ${user_info.last_name})
    ✏ Текст заметки: ${zametka[0].text} `)
    });
});
});
vk.updates.hear(/^(?:команда заметки|!команда заметки)\s(.*)\s(.*)?/i, (message) => { 
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, chel, fields){ 
    chat.mysql.db.query('SELECT * FROM `zametki` WHERE `chat_id` ="' + message.chatId +'" AND `name` ="' + message.$match[1] +'"', async function(err, zametka, fields){
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, rows, fields){
    if(rows[0].gold == 0||rows[0].gold_time < getUnix()) return message.send(`Данная функция доступна только в золотых беседах.`)
    if(zametka == 0) return message.send(`Такой заметки не существует.`)
    if(chel[0].rol < zametka[0].rol) return message.send(`Недостаточно прав для просмотра этой заметки.`)
    chat.mysql.db.query('SELECT * FROM `zametki` WHERE `chat_id` ="' + message.chatId +'" AND `command` ="' + message.$match[2] +'"', async function(err, command, fields){
    if(command != 0) return message.send(`Заметка с такой командой уже существует.`)
    chat.mysql.db.query('UPDATE `zametki` SET `command` = "'+ message.$match[2] + '" WHERE `name` = "' + message.$match[1] +'" AND `chat_id` = "' + message.chatId +'"');  
    return message.send(`Теперь заметку «${zametka[0].name}» можно вызывать командой «${message.$match[2]}»`)
    });
});
});
});
});
vk.updates.hear(/^(?:рассылка)\s?([^]+)?/i,  context => { 
	bot.mysql.db.query('SELECT * FROM `accounts`', async function(err,result){
		for (i = 0; i < result.length; i++) {
		vk.api.messages.send({peer_id: result[i].vk, message: context.$match[1]});
	}
	})
	});
vk.updates.hear(/^(?:заметку удалить|удалить заметка|удалить заметку|!заметку удалить|!удалить заметка|!удалить заметку)\s?(.*)?/i, (message) => {
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    chat.mysql.db.query('SELECT * FROM `zametki` WHERE `chat_id` ="' + message.chatId +'" AND `name` ="' + message.$match[1] +'"', async function(err, zametka, fields){
     chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, user, fields){ 
        if(user[0].rol < 6) return message.reply(`Недостаточно прав для применения этой команды.`);  
    if(zametka == 0) return message.send(`Такой заметки не существует.`)
        await chat.mysql.db.query('DELETE FROM `zametki` WHERE `name` ="' + message.$match[1] +'" AND `chat_id` ="' + message.chatId +'"');  
    return message.send(`Заметка успешно удалена.`)
    });
});
});
    vk.updates.hear(/^(?:Снежик обновить|!Снежик обновить)$/i, async (message) => {
        chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, rows, fields){
			chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, user, fields){ 
            if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
      
            let ogoblya = await vk.api.messages.getConversationMembers({ peer_id: message.peerId, fields: "id", group_id: 193270463}).then(function(response){
                var c = response;
                if(c.items[0].member_id > 0) {
                if(c.items[0].is_owner == true){
                return c.items[0].member_id;
                }
                }
                });
        if(user[0].rol < 6) return message.send(`❌ Вы не создатель чата`)

        vk.api.messages.getConversationsById({
            peer_ids: 2000000000 + message.chatId
            }).then(res => {
        if (rows == 0) {
         chat.mysql.db.query("INSERT IGNORE INTO `chats` (`id`,`owner`,`name`,`url`,`lvl`,`ssilki`) VALUES ('"+ message.chatId + "'," + message.senderId + ",'"+ res.items[0].chat_settings.title +"','0','1','1')")
        message.send(`Чат успешно зарегистрирован. Теперь вы можете использовать мои команды.

        📚 Список команд: vk.com/@snezhikbot-cmds
        📙 Правила бота: https://vk.cc/asYSp2`);
        }else{
           chat.mysql.db.query("UPDATE `chats` SET `name` = '"+ message.payload.action.text +"' WHERE `id` = " + message.chatId); 
           message.send(`Чат успешно обновлен.`);
           }
    });
    });
});
	});
updates.hear(/^(?:ссылка|!ссылка)\s?(.*)?/i, async (message) => { 
    chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, rows, fields){
        if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
  
        let ogoblya = await vk.api.messages.getConversationMembers({ peer_id: message.peerId, fields: "id", group_id: 193270463}).then(function(response){
            var c = response;
            if(c.items[0].member_id > 0) {
            if(c.items[0].is_owner == true){
            return c.items[0].member_id;
            }
            }
            });
    if(ogoblya != message.senderId) return message.send(`❌ Вы не создатель чата`)
    if (!/join/i.test(message.$match[1].toLowerCase())) {
        return message.send(`Не верная ссылка на приглашение в чат.`)
    }
       chat.mysql.db.query("UPDATE `chats` SET `url` = '"+ message.$match[1] +"' WHERE `id` = " + message.chatId); 
       message.send(`Ссылка на приглашение в чат, успешно установлена - ${message.$match[1]}`);
});
});
    vk.updates.hear(/^(?:команды|помощь|список команд|!команды|!помощь|!список команд)$/i, async (message) => {
            chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, chat, fields){ 
                if(!message.isChat) return message.send(`Команды, доступные в ЛС:

    • Профиль
    • Все мои беседы
    • Золотая беседа
    • Донат
    • Беседы
    
    С функционалом для бесед вы можете ознакомиться в меню: vk.com/@snezhikbot
    `)
            if(chat == 0) return message.send(`❌ Этот чат еще не прошел регистрацию. 
            Выдайте мне статус администратора и напишите команду "Снежик обновить"`)
            return message.send(`
            С функционалом для бесед вы можете ознакомиться в меню: vk.com/@snezhikbot
            `)
      
    });
});
vk.updates.hear(/^(?:беседы|!беседы)$/i, async (message) => {
    chat.mysql.db.query('SELECT * FROM `chats` WHERE url != "0"', async function(err, besed, fields){ 
    if(besed == 0) return message.send(`Список бесед, с приглашением пуст.`)
    if(!message.isChat) return message.send(`Список бесед, с приглашением:
    ${besed.map((x) => `👑 | [#${x.id}]: ${x.name} (${x.lvl} ур.)\n${x.url}\n`).join("\n")}
    `)
});
}); 
    updates.hear(/^(?:напиши|!напиши)\s?(.*)?/i, async (message) => { 
        if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
        if(rows[0].rol < 2) return message.reply(`Недостаточно прав для применения этой команды.`);  
        message.send(`${message.$match[1]}`); 
        }); 
    });
    updates.hear(/^(?:кик|kick|remove|!кик|!kick|!remove)\s?(.*)?/i, async (message) => { 
        let count = ['8939','6354','15592','3163','6679'].random();
        if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
        const uchas = await vk.snippets.resolveResource(message.$match[1]);
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){ 
        bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + uchas.id +'"', async function(err, chel, fields){ 
        if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы удалить этого пользователя из беседы.`); 
        if(uchas.id == message.senderId) return message.sendSticker(`${count}`);   
        if(rows[0].rol == row[0].rol||rows[0].rol < row[0].rol) return message.reply(`Ваш уровень прав ниже или равен уровню прав изменяемого участника.`); 
        vk.api.call('messages.removeChatUser', { 
        chat_id: message.chatId, 
        user_id: uchas.id 
        }); 
        message.send(`Пользователь @id${uchas.id} (${chel[0].name}) был исключен из беседы.`); 
        }); 
        }); 
        }); 
    });
    vk.updates.hear(/^(?:мут|mute|!мут|!mute)\s(.*)\s([0-9]+)\s([А-я]+)?$/i, async (message) => { 

        let count = ['8939','6354','15592','3163','6679'].random();
        if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
        const uchas = await vk.snippets.resolveResource(message.$match[1]);
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){
        if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы снять предупреждение этому пользователю.`);
        if(uchas.id == message.senderId) return message.sendSticker(`${count}`);   
        if(rows[0].rol == row[0].rol||rows[0].rol < row[0].rol) return message.reply(`Ваш уровень прав ниже или равен уровню прав изменяемого участника.`); 
        let time = 0
        if(/сек/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (1000*message.$match[2])}
        if(/мин/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (60000*message.$match[2])}
        if(/час/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (3600000*message.$match[2])}
        if(/день|дней/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (86400000*message.$match[2])}
        if(/нед/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (604800000*message.$match[2])}
        if(/мес/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (2592000000*message.$match[2])}
        if(/год|лет/i.test(message.$match[3].toLowerCase())) {time = getUnix() + (31536000000*message.$match[2])}
        const [user_info] = await vk.api.users.get({
            user_id: uchas.id,
            name_case: 'dat',
            fields: 'first_name,last_name'
            });
        chat.mysql.db.query('UPDATE `users` SET `mute` = "'+ time +'"  WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"');    
        message.send(`@id${uchas.id} (${user_info.first_name} ${user_info.last_name}) было запрещено писать сообщения в беседе до [${unixStamp(time)} GMT+3].
        При нарушении запрета будет применено наказание.`)
        });
        });
        });
        vk.updates.hear(/^(?:tempban|врембан|!tempban|!врембан)\s(.*)\s([0-9]+)\s([А-я]+)?$/i, async (message) => { 
        let count = ['8939','6354','15592','3163','6679'].random();
        if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
        const uchas = await vk.snippets.resolveResource(message.$match[1]);
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){
        bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + uchas.id +'"', async function(err, chel, fields){
        if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы временно заблокировать этого пользователя.`);
        if(uchas.id == message.senderId) return message.sendSticker(`${count}`);   
        if(rows[0].rol == row[0].rol||rows[0].rol < row[0].rol) return message.reply(`Ваш уровень прав ниже или равен уровню прав изменяемого участника.`); 
        if(message.$match[2])
        {
            let timeb = 0
            if(/сек/i.test(message.$match[3].toLowerCase())) {timeb = getUnix() + (1000*message.$match[2])}
            if(/мин/i.test(message.$match[3].toLowerCase())) {timeb = getUnix() + (60000*message.$match[2])}
            if(/час/i.test(message.$match[3].toLowerCase())) {timeb = getUnix() + (3600000*message.$match[2])}
            if(/день|дней/i.test(message.$match[3].toLowerCase())) {timeb = getUnix() + (86400000*message.$match[2])}
            if(/нед/i.test(message.$match[3].toLowerCase())) {timeb = getUnix() + (604800000*message.$match[2])}
            if(/мес/i.test(message.$match[3].toLowerCase())) {timeb = getUnix() + (2592000000*message.$match[2])}
            if(/год|лет/i.test(message.$match[3].toLowerCase())) {timeb = getUnix() + (31536000000*message.$match[2])}
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, user_id: uchas.id }) 
        .catch((error) => {return message.send(`Error.`); 
        }); 
        const [user_info] = await vk.api.users.get({
            user_id: message.senderId,
            name_case: 'ins',
            fields: 'first_name,last_name'
            });
            await chat.mysql.db.query('UPDATE `users` SET `tban` = "' + timeb +'" WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
            await chat.mysql.db.query('UPDATE `users` SET `ban` = 0 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
        message.send(`Пользователь @id${row[0].user_id} (${chel[0].name}) был заблокирован до ${unixStamp(timeb)} `)
        if(chel[0].uvedom == 1)
        {
        vk.api.messages.getConversationsById({
            peer_ids: 2000000000 + message.chatId
            }).then(res => {
         
        vk.api.call("messages.send", {
        user_id: uchas.id,
        message: `😔 Получен бан в чате «${res.items[0].chat_settings.title}» 
        ⏳ Начало: ${data()} ${time()} GMT+3 
        ⌛ Окончание: ${unixStamp(timeb)} 
        👑 Бан выдан @id${message.senderId} (${user_info.first_name} ${user_info.last_name}).`,
        random_id: 0
        })
    });
        }
    }       
        
        });
        });
        });
        });
            vk.updates.hear(/^(?:размут|unmute|!размут|!unmute)\s?(.*)?/i, async (message) => { 

                let count = ['8939','6354','15592','3163','6679'].random();
                if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
                const uchas = await vk.snippets.resolveResource(message.$match[1]);
                chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){
                chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){
                if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы снять блокировку сообщений этому пользователю.`);
                if(uchas.id == message.senderId) return message.sendSticker(`${count}`);   
                if(row[0].mute == 0) return message.reply(`У этого пользователя нет блокировки сообщений.`);
                if(rows[0].rol == row[0].rol||rows[0].rol < row[0].rol) return message.reply(`Ваш уровень прав ниже или равен уровню прав изменяемого участника.`); 
                let time = 0
                const [user_info] = await vk.api.users.get({
                    user_id: uchas.id,
                    name_case: 'dat',
                    fields: 'first_name,last_name'
                    });
                chat.mysql.db.query('UPDATE `users` SET `mute` = 0  WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"');    
                message.send(`@id${uchas.id} (${user_info.first_name} ${user_info.last_name}) было разрешено писать сообщения в беседе.`)
                });
                });
                });
                vk.updates.hear(/^(?:разбан|unban|!разбан|!unban)\s?(.*)?/i, async (message) => { 

                    let count = ['8939','6354','15592','3163','6679'].random();
                    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
                    const uchas = await vk.snippets.resolveResource(message.$match[1]);
                    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){
                    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){
                    if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы снять блокировку этому пользователю.`);
                    if(uchas.id == message.senderId) return message.sendSticker(`${count}`);   
                    if(row[0].ban == 0&&row[0].tban == 0) return message.reply(`Данного пользователя нет в списке заблокированных.`);
                    if(rows[0].rol == row[0].rol||rows[0].rol < row[0].rol) return message.reply(`Ваш уровень прав ниже или равен уровню прав изменяемого участника.`); 
                    let time = 0
                    const [user_info] = await vk.api.users.get({
                        user_id: uchas.id,
                        fields: 'first_name,last_name,sex'
                        });
                    chat.mysql.db.query('UPDATE `users` SET `ban` = 0  WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"');   
                    chat.mysql.db.query('UPDATE `users` SET `tban` = 0  WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
                    let bila = 0
                    if(user_info.sex == 1) {bila = 'была'}
                    if(user_info.sex == 2) {bila = 'был'}
                    if(user_info.sex == 0) {bila = 'был'}
                    message.send(`@id${uchas.id} (${user_info.first_name} ${user_info.last_name}) ${bila} разблокирован.`)
                    });
                    });
                    });
        vk.updates.hear(/^(?:ban|бан|!ban|!бан)\s?(.*)?/i, async (message) => { 
            if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
            let count = ['8939','6354','15592','3163','6679'].random();
            const uchas = await vk.snippets.resolveResource(message.$match[1]);
            
            chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
            chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){ 
            bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + uchas.id +'"', async function(err, chel, fields){ 
            if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы дать бан этому пользователю.`); 
            if(uchas.id == message.senderId) return message.sendSticker(`${count}`);   
            if(rows[0].rol == row[0].rol||rows[0].rol < row[0].rol) return message.reply(`Ваш уровень прав ниже или равен уровню прав изменяемого участника.`);  	
            if(!message.$match[2])
            {
            chat.mysql.db.query('UPDATE `users` SET `ban` = 1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
            vk.api.call("messages.removeChatUser", {chat_id: message.chatId, user_id: uchas.id }) 
            .catch((error) => {return message.send(`Данного пользователя нет в беседе.`); 
            }); 
            const [user_info] = await vk.api.users.get({
                user_id: message.senderId,
                name_case: 'ins',
                fields: 'first_name,last_name'
                });
            message.send(`Пользователь @id${row[0].user_id} (${chel[0].name}) был заблокирован навечно.`)
            if(chel[0].uvedom == 1)
            {
            vk.api.messages.getConversationsById({
                peer_ids: 2000000000 + message.chatId
                }).then(res => {
             
            vk.api.call("messages.send", {
            user_id: uchas.id,
            message: `😔 Получен бан в чате «${res.items[0].chat_settings.title}» 
            ⏳ Начало: ${data()} ${time()} GMT+3 
            ⌛ Окончание: бессрочный (никогда) 
            👑 Бан выдан @id${message.senderId} (${user_info.first_name} ${user_info.last_name}).`,
            random_id: 0
            })
        });
            }
            }
                        }); 
                    }); 
                        });
                });
        updates.hear(/^(?:warn|пред|!warn|!пред)\s?(.*)?/i, async (message) => { 
            let count = ['8939','6354','15592','3163','6679'].random();
        if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
        const uchas = await vk.snippets.resolveResource(message.$match[1]);
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){ 
        bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + uchas.id +'"', async function(err, chel, fields){ 
        if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы дать предупреждение этому пользователю.`); 
        if(uchas.id == message.senderId) return message.sendSticker(`${count}`);   
        if(rows[0].rol == row[0].rol||rows[0].rol < row[0].rol) return message.reply(`Ваш уровень прав ниже или равен уровню прав изменяемого участника.`);    
        if(row[0].warn+1 >= 3){ 
        chat.mysql.db.query('UPDATE `users` SET `warn` = 0 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
        chat.mysql.db.query('UPDATE `users` SET `ban` = 1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
        vk.api.call("messages.removeChatUser", {chat_id: message.chatId, user_id: uchas.id }) 
        .catch((error) => {return message.send(`Error.`); 
        }); 
        return message.send(`Пользователь @id${row[0].user_id} (${chel[0].name}) получил предупреждение 3/3 и был исключен из беседы`); 
        }else{ 
        chat.mysql.db.query('UPDATE `users` SET `warn` = `warn` + 1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
        return message.send(`Пользователь @id${row[0].user_id} (${chel[0].name}) получил предупреждение ${row[0].warn+1}/3.
        У @id${row[0].user_id} (${chel[0].name}) теперь ⚠ [${row[0].warn+1}/3] предупреждений.`); 
        } 
        }); 
        }); 
        }); 
});
updates.hear(/^(?:разпред|unwarn|!разпред|!unwarn)\s?(.*)?/i, async (message) => {
    let count = ['8939','6354','15592','3163','6679'].random();
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    const uchas = await vk.snippets.resolveResource(message.$match[1]);
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){ 
    bot.mysql.db.query('SELECT * FROM `accounts` WHERE `vk` ="' + uchas.id +'"', async function(err, chel, fields){ 
    if(rows[0].rol < 2) return message.reply(`Недостаточно прав для того, чтобы снять предупреждение этому пользователю.`); 
    if(uchas.id == message.senderId) return message.sendSticker(`${count}`);    
    if(row[0].warn == 0) return message.reply(`У пользователя нет предупреждений.`); 
    if(message.$match[2]){ 
        if(message.$match[2] > row[0].warn) return message.reply(`У пользователя нет столько предупреждений.`); 
        chat.mysql.db.query('UPDATE `users` SET `warn` = `warn` - '+ message.$match[2] +' WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
        return message.send(`У @id${row[0].user_id} (${chel[0].name} ${chel[0].surname}) теперь ⚠ [${row[0].warn-message.$match[2]}/3] предупреждений.`); 
        }else if(!message.$match[2]){ 
    chat.mysql.db.query('UPDATE `users` SET `warn` = `warn` - 1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
    return message.send(`У @id${row[0].user_id} (${chel[0].name} ${chel[0].surname}) теперь ⚠ [${row[0].warn-1}/3] предупреждений.`); 
    }
    }); 
    }); 
    }); 
});
vk.updates.hear(/^(?:созвать всех|!созвать всех)$/i, async (message) => {
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
    if(rows[0].rol < 3) return message.reply(`Недостаточно прав для того, чтобы снять предупреждение этому пользователю.`); 
    const user = await vk.api.users.get({ user_id: message.senderId });
	vk.api.messages.getConversationMembers({
	peer_id: message.peerId,
	fields: "online"
	}).then(async function (response) {
	let text = `@id${message.senderId} (${user[0].first_name} ${user[0].last_name}) Вызывает вас\n`;
	await response.profiles.map(e => {
	if(e.id < 1) return;
	if(e.online != 0)
	{
	text += `*id${e.id} (&#4448;)`;
	}
	})
	return message.send(text);
	})
    }); 
}); 
        updates.hear(/^(?:роль|!роль)\s?(.*)?/i, async (message) => {
            if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`) 
            if(message.$match[1])
            {
                const uchas = await vk.snippets.resolveResource(message.$match[1]);
                chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){
                return message.send(`Роль @id${uchas.id} (пользователя) — [${row[0].rol.toString().replace(/1/gi, "Участник").replace(/2/gi, "Модератор").replace(/3/gi, "Ст.Модератор").replace(/4/gi, "Администратор").replace(/5/gi, "Гл.Администратор").replace(/6/gi, "Создатель беседы")}].`)
            });
            }
            else
            {
            chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
            return message.send(`Ваша роль в беседе — [${rows[0].rol.toString().replace(/1/gi, "Участник").replace(/2/gi, "Модератор").replace(/3/gi, "Ст.Модератор").replace(/4/gi, "Администратор").replace(/5/gi, "Гл.Администратор").replace(/6/gi, "Создатель беседы")}].`)
            }); 
            }
    });
        updates.hear(/^(?:повысить|!повысить)\s?(.*)?/i, async (message) => {
            let count = ['8939','6354','15592','3163','6679'].random();
            if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`) 
            const uchas = await vk.snippets.resolveResource(message.$match[1]);
            chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
            chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){ 
            const [user_info] = await vk.api.users.get({
                    user_id: uchas.id,
                    name_case: 'acc',
                    fields: 'first_name,last_name'
                    });
            if(rows[0].rol < 4) return message.reply(`Недостаточно прав для редактирования ролей участников.`); 
            if(uchas.id == message.senderId) return message.sendSticker(`${count}`);    
            if(row[0].rol > 4) return message.reply(`Невозможно повысить данного пользователя.`);
            await  chat.mysql.db.query('UPDATE `users` SET `rol` = `rol` +  1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"');
            let newrol = row[0].rol+1
            message.send(`Теперь у @id${uchas.id} (${user_info.first_name} ${user_info.last_name}) роль [${newrol.toString().replace(/1/gi, "Участник").replace(/2/gi, "Модератор").replace(/3/gi, "Ст.Модератор").replace(/4/gi, "Администратор").replace(/5/gi, "Гл.Администратор").replace(/6/gi, "Создатель беседы")}].`)
            }); 
        });
    });
    updates.hear(/^(?:понизить|!понизить)\s?(.*)?/i, async (message) => {
        let count = ['8939','6354','15592','3163','6679'].random();
        if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`) 
        const uchas = await vk.snippets.resolveResource(message.$match[1]);
        if(!uchas) return;
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, rows, fields){ 
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"', async function(err, row, fields){ 
        const [user_info] = await vk.api.users.get({
                user_id: uchas.id,
                name_case: 'acc',
                fields: 'first_name,last_name'
                });
        if(rows[0].rol < 4) return message.reply(`Недостаточно прав для редактирования ролей участников.`); 
        if(uchas.id == message.senderId) return message.sendSticker(`${count}`);    
        if(row[0].rol == 1) return message.reply(`Невозможно понизить данного пользователя.`);
        await  chat.mysql.db.query('UPDATE `users` SET `rol` = `rol` -  1 WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + uchas.id +'"'); 
        let newrol = row[0].rol-1
        message.send(`Теперь у @id${uchas.id} (${user_info.first_name} ${user_info.last_name}) роль [${newrol.toString().replace(/1/gi, "Участник").replace(/2/gi, "Модератор").replace(/3/gi, "Ст.Модератор").replace(/4/gi, "Администратор").replace(/5/gi, "Гл.Администратор").replace(/6/gi, "Создатель беседы")}].`)
        }); 
    });
});
updates.hear(/^(?:списокпредов|!списокпредов)\s?(.*)?/i, async (message) => {
    chat.mysql.db.query('SELECT COUNT(*) AS count FROM users WHERE warn > 0 AND `chat_id` ="' + message.chatId +'"', async function(err, vsegorol, fields){
    chat.mysql.db.query('SELECT * FROM users WHERE warn > 0 AND `chat_id` ="' + message.chatId +'"', async function(err, rol, fields){
    if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
    let sozd;
    let devels = ``;
    sozd = '\n';
    for(var i = 0; i < rol.length; i++) {
        const [user_info] = await vk.api.users.get({
            user_id: rol[i].user_id,
            fields: 'first_name,last_name'
            });
    if (rol[i].rol > 0) sozd += `@id${rol[i].user_id} (${user_info.first_name} ${user_info.last_name}) - ${rol[i].warn}/3\n`;
    }
    let uchast = plural(vsegorol[0].count, `участник`, `участника`, `участников`)
    let text = `В беседе (${vsegorol[0].count}) ${uchast} с предупреждениями.`;
    if(sozd == "") sozd = ``;
    if (sozd.length != 24) text += sozd + `\n`;
    return message.send(text)
    });
    });
});
        updates.hear(/^(?:stuff|управляющие|staff|!stuff|!управляющие|!staff)\s?(.*)?/i, async (message) => {
            chat.mysql.db.query('SELECT COUNT(*) AS count FROM users WHERE rol > 1 AND `chat_id` ="' + message.chatId +'"', async function(err, vsegorol, fields){
            chat.mysql.db.query('SELECT * FROM users WHERE rol > 1 AND `chat_id` ="' + message.chatId +'"', async function(err, rol, fields){
            if(!message.isChat) return message.send(`Команду [${message.text.toLowerCase()}] нельзя использовать в личном диалоге.`)
            let sozd, moder, star, admins,gladmins;
            let devels = ``;
            sozd = '\nСоздатель беседы:\n';
            moder = '\nМодератор:\n';
            star = '\nСт.Модератор:\n';
            admins = '\nАдминистратор:\n';
            gladmins = '\nГл.Администратор:\n';
            for(var i = 0; i < rol.length; i++) {
                const [user_info] = await vk.api.users.get({
                    user_id: rol[i].user_id,
                    fields: 'first_name,last_name'
                    });
            if (rol[i].rol == 6) sozd += `@id${rol[i].user_id} (${user_info.first_name} ${user_info.last_name})`;
            if (rol[i].rol == 2) moder += `@id${rol[i].user_id} (${user_info.first_name} ${user_info.last_name}), `;
            if (rol[i].rol == 3) star += `@id${rol[i].user_id} (${user_info.first_name} ${user_info.last_name}), `;
            if (rol[i].rol == 4) admins += `@id${rol[i].user_id} (${user_info.first_name} ${user_info.last_name}), `;
            if (rol[i].rol == 5) gladmins += `@id${rol[i].user_id} (${user_info.first_name} ${user_info.last_name}), `;
            }
            let uchast = plural(vsegorol[0].count, `пользователь`, `пользователя`, `пользователей`)
            let text = `В конференции [${vsegorol[0].count} всего] ${uchast} с ролью выше участника.\n`;
            if(sozd == "\nСоздатель беседы:\n") sozd = ``;
            if(moder == "\nМодератор:\n") moder = ``;
            if(star == "\nСт.Модератор:\n") star = ``;
            if(admins == "\nАдминистратор:\n") admins = ``;
            if(gladmins == "\nГл.Администратор:\n") gladmins = ``;
            if (sozd.length != 24) text += sozd + `\n`;
            if (moder.length != 24) text += moder + `\n`;
            if (star.length != 24) text += star + `\n`;
            if (admins.length != 24) text += admins + `\n`;
            if (gladmins.length != 24) text += gladmins + `\n`;
            return message.send(text)
            });
            });
        });
        vk.updates.hear(/([^])/, (message) => {
        if(!message.isChat) return message.send(`
        Команды, доступные в ЛС:

• Профиль
• Все мои беседы
• Золотая беседа
• Донат
• Беседы

С функционалом для бесед вы можете ознакомиться в меню: vk.com/@snezhikbot`);
        chat.mysql.db.query('SELECT * FROM `users` WHERE `chat_id` ="' + message.chatId +'" AND `user_id` ="' + message.senderId +'"', async function(err, chel, fields){ 
        chat.mysql.db.query('SELECT * FROM `zametki` WHERE `chat_id` ="' + message.chatId +'" AND `command` ="' + message.text +'"', async function(err, zametka, fields){
        chat.mysql.db.query('SELECT * FROM `chats` WHERE `id` ="' + message.chatId +'"', async function(err, beseda, fields){
        if(zametka == 0) return;
        if(beseda == 0) return;
        if(beseda[0].gold == 0) return;
        if(message.text == zametka[0].command){
        if(chel[0].rol < zametka[0].rol) return message.send(`Недостаточно прав для просмотра этой заметки.`)
        const [user_info] = await vk.api.users.get({
        user_id: zametka[0].owner,
        fields: 'first_name,last_name'
        });
        return message.send(`
        Заметка «${zametka[0].name}»
        Сообщение от: @id${zametka[0].owner} (${user_info.first_name} ${user_info.last_name})
        ✏ Текст заметки: ${zametka[0].text} `)
        }
        });
                    })	
                     })
                    })
 vk.updates.use(questionManager.middleware);
async function run() {
    await vk.updates.startPolling();
    console.log(`Включен`);

}

run().catch(console.error);

const utils = {
    sp: (int) => {
        int = int.toString();
        return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
    },
	 st: (int) => {
        int = int.toString();
        return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join(' ').split('').reverse().join('');
    },
    rn: (int, fixed) => {
        if (int === null) return null;
        if (int === 0) return '0';
        fixed = (!fixed || fixed < 0) ? 0 : fixed;
        let b = (int).toPrecision(2).split('e'),
            k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
            c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3)).toFixed(1 + fixed),
            d = c < 0 ? c : Math.abs(c),
            e = d + ['', 'к', 'кк', 'ккк', 'кккк'][k];

        e = e.replace(/e/g, '');
        e = e.replace(/\+/g, '');
        e = e.replace(/Infinity/g, ' Бесконечность');
        e = e.replace(/undefined/g, ' Бесконечность');
        e = e.replace(/NaN/g, ' Бесконечность');
        e = e.replace(/Nan/g, ' Бесконечность');
        e = e.replace(/Null/g, ' Бесконечность');
        e = e.replace(/null/g, ' Бесконечность');

        return e;
    },
    banan: (int, fixed) => {
        if (int === null) return null;
        if (int === 0) return '0';
        fixed = (!fixed || fixed < 0) ? 0 : fixed;
        let b = (int).toPrecision(2).split('e'),
            k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
            c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3)).toFixed(1 + fixed),
            d = c < 0 ? c : Math.abs(c),
            e = d + ['', ' тыс', ' млн', ' млрд', ' трл'][k];

        e = e.replace(/e/g, '');
        e = e.replace(/\+/g, '');
        e = e.replace(/Infinity/g, ' Бесконечность');
        e = e.replace(/undefined/g, ' Бесконечность');
        e = e.replace(/NaN/g, ' Бесконечность');
        e = e.replace(/Nan/g, ' Бесконечность');
        e = e.replace(/Null/g, ' Бесконечность');
        e = e.replace(/null/g, ' Бесконечность');

        return e;
    },
    gi: (int) => {
        int = int.toString();

        let text = ``;
        for (let i = 0; i < int.length; i++) {
            text += `${int[i]}⃣`;
        }

        return text;
    },
    decl: (n, titles) => {
        return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
    },
    random: (x, y) => {
        return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
    },
    pick: (array) => {
        return array[utils.random(array.length - 1)];
    }
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  } 
const smileerror = utils.pick([`😒`, `😯`, `😔`, `🤔`]);
const smilesuccess = utils.pick([`😯`, `🙂`, `🤑`, `☺`]);
function getUnix() {
    return Date.now();
}
	function data() {
		var date = new Date();
		let days = date.getDate();
		let month = date.getMonth() + 1; 
		if (month < 10) month = "0" + month;
		if (days < 10) days = "0" + days;
		var datas = days + '.' + month + '.2020' ;
		return datas;
	}
	function bdata() {
		var date = new Date();
		let days = date.getDate();
		let month = date.getMonth() + 1; 
		if (month < 10) month = "0" + month;
		if (days < 10) days = "0" + days;
		var datas = '2020'+'-'+ month +'-'+ days;
		return datas;
	}
	function time() {
			let date = new Date();
			let days = date.getDate();
			let hours = date.getHours();
			let minutes = date.getMinutes();
			if (hours < 10) hours = "0" + hours;
			if (minutes < 10) minutes = "0" + minutes;
			var times = hours + ':' + minutes
			return times;
	}
function unixStamp(stamp) {
    let date = new Date(stamp),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        mins = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
        secs = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return `${day}.${month}.${year}, ${hour}:${mins}:${secs}`;
}

function unixStampLeft(stamp) {
	stamp = stamp / 1000;
	let s = stamp % 60;
	stamp = ( stamp - s ) / 60;
	let m = stamp % 60;
	stamp = ( stamp - m ) / 60;
	let h = ( stamp ) % 24;
	let d = ( stamp - h ) / 24;
	let text = ``;
	if(d > 0) text += Math.floor(d) + " дн ";
	if(h > 0) text += Math.floor(h) + " ч. ";
	if(m > 0) text += Math.floor(m) + " мин. ";
	if(s > 0) text += Math.floor(s) + " сек.";
	return text;
}
function rand(min, max) {return Math.round(Math.random() * (max - min)) + min} 
var parserInt = (str) => parseInt(str.replace(/k|к/ig, "000"));
function spaces(string) {
	if (typeof string !== "string") string = string.toString();
	return string.split("").reverse().join("").match(/[0-9]{1,3}/g).join(".").split("").reverse().join("");
};
Array.prototype.random = function() {  
	return this[Math.floor(this.length * Math.random())];
}
function empty (mixedVar) {

    var undef
    var key
    var i
    var len
    var emptyValues = [undef, null, false, 0, '', '0']
    
    for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
    return true
    }
    }
    
    if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
    if (mixedVar.hasOwnProperty(key)) {
    return false
    }
    }
    return true
    }
    
    return false
    }
function generateKeyboard(array) {
    let kb = [];
    if (array.length > 40) return false;

    for (let i = 0; i < 10; i += 1) {
        if (!array.slice(i * 4, i * 4 + 4)[0]) break;
        kb.push(array.slice(i * 4, i * 4 + 4));
    }

    kb.map((arr) => {
        arr.map((button, i) => {
            arr[i] = Keyboard.textButton({
                label: button
            });
        });
    });

    return Keyboard.keyboard(kb);
}

	