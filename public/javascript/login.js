//login handler
const loginFormHandler = async (event) => {
  event.preventDefault();
  //username and password
  const username = document.querySelector("#username-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();
  //check if username and password exist
  if (username && password) {
    //post to api/users/login
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      //redirect to dashboard
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
};
document
  .querySelector(".login-form")
  .addEventListener("submit", loginFormHandler);

//discord expanding widget
const client = new Discord.Client();

client.on("message", (message) => {
  if (message.content === "!expand") {
    const embed = new Discord.MessageEmbed()
      .setTitle("Click to Expand")
      .setDescription("This is the initial content of the expanding widget.");

    message.channel.send(embed).then((sentEmbed) => {
      sentEmbed.react("🔽");

      const filter = (reaction, user) =>
        reaction.emoji.name === "🔽" && user.id === message.author.id;
      const collector = sentEmbed.createReactionCollector(filter, {
        time: 60000,
      });

      collector.on("collect", () => {
        embed.setDescription(
          "This is the expanded content of the expanding widget."
        );
        sentEmbed.edit(embed);
      });
    });
  }
});

client.login("your-bot-token");
