async function respondInteraction(interaction, message, ephemeral = true) {
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({content: message, ephemeral: ephemeral});
    } else {
        await interaction.reply({content: message, ephemeral: ephemeral});
    }
}

module.exports = {
    respondInteraction: respondInteraction,
}
