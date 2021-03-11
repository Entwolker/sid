const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./command')

client.on('ready', () => {
    console.log('Client ready')

    command(client, 'ping', (message) => {
        message.channel.send('Pong!')
    })

    command(client, ['cc', 'clear'], (message) => {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        }
    });

    command(client, 'status', (message) => {
        const content = message.content.replace('.status ', '')
        if (message.member.hasPermission('ADMINISTRATOR')) {
            client.user.setPresence({
                activity: {
                    name: content,
                    type: 0
                }
            })
        }
    })

    command(client, 'serverinfo', (message) => {
        const { guild } = message
        const { name, region, memberCount, owner } = guild;
        const icon = guild.iconURL()
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Serverinfo for ${name}`)
            .setThumbnail(icon)
            .addFields(
                {
                    name: 'Membercount',
                    value: memberCount
                },
                {
                    name: 'Region',
                    value: region
                },
                {
                    name: 'Owner',
                    value: owner.user.tag
                })
        message.channel.send(embed)
    })

    command(client, 'ban', (message) => {
        const {member, mentions} = message
        
        const tag = `<@${member.id}>`

        if(member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()
            if(target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.channel.send(`${tag} That user has been banned.`)
            } else {
                message.channel.send(`${tag} Please specity a member to ban.`)
            }
        } else {
            message.channel.send(`${tag} You don't have permissions to do that.`)
        }
    })

    command(client, 'kick', (message) => {
        const {member, mentions} = message
        
        const tag = `<@${member.id}>`

        if(member.hasPermission('KICK_MEMBERS')) {
            const target = mentions.users.first()
            if(target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.kick()
                message.channel.send(`${tag} That user has been kicked.`)
            } else {
                message.channel.send(`${tag} Please specity a member to kick.`)
            }
        } else {
            message.channel.send(`${tag} You don't have permissions to do that.`)
        }
    })
})

client.login(config.token)