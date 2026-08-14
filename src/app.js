import "dotenv/config";
import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
} from "discord.js";
import express from "express";

import config from "./config/application.js";
import {
  loadCommands,
  registerCommands,
} from "./handlers/loaders/commandLoader.js";
import logger from "./utils/logger.js";

class LegacyStoreBot extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
      ],
    });

    this.config = config;

    this.commands = new Collection();
    this.events = new Collection();
    this.buttons = new Collection();
    this.selectMenus = new Collection();
    this.modals = new Collection();
    this.cooldowns = new Collection();

    this.rest = new REST({ version: "10" }).setToken(
      config.bot.token,
    );

    this.webServer = null;
  }

  async start() {
    try {
      console.log("========================================");
      console.log("       LEGACY STORE BOT STARTING");
      console.log("========================================");

      if (!config.bot.token) {
        throw new Error("DISCORD_TOKEN/TOKEN is missing.");
      }

      if (!config.bot.clientId) {
        throw new Error("CLIENT_ID is missing.");
      }

      console.log("Loading commands...");
      await loadCommands(this);
      console.log(`Loaded ${this.commands.size} commands.`);

      console.log("Loading handlers...");
      await this.loadHandlers();

      console.log("Starting web server...");
      this.startWebServer();

      console.log("Logging into Discord...");
      await this.login(config.bot.token);

      console.log("Discord login successful.");

      console.log("Registering slash commands...");
      await this.registerCommands();

      console.log("========================================");
      console.log("       LEGACY STORE BOT ONLINE");
      console.log("========================================");
      console.log(`Commands: ${this.commands.size}`);
      console.log(`Servers: ${this.guilds.cache.size}`);
      console.log(`User: ${this.user?.tag}`);

      this.setupPresence();
    } catch (error) {
      console.error("Failed to start bot:", error);
      process.exit(1);
    }
  }

  setupPresence() {
    if (!this.user) return;

    this.user.setPresence({
      status: "online",
      activities: [
        {
          name: "LEGACY STORE",
          type: 3,
        },
      ],
    });
  }

  startWebServer() {
    const app = express();

    const port = Number(process.env.PORT || 3000);
    const host = process.env.WEB_HOST || "0.0.0.0";

    app.get("/", (req, res) => {
      res.status(200).json({
        status: "online",
        bot: "LEGACY STORE",
        version: "V1",
        uptime: process.uptime(),
      });
    });

    app.get("/health", (req, res) => {
      res.status(200).json({
        status: "healthy",
        bot: "LEGACY STORE",
        discord: this.isReady(),
        guilds: this.guilds.cache.size,
        commands: this.commands.size,
        uptime: process.uptime(),
      });
    });

    this.webServer = app.listen(port, host, () => {
      console.log(
        `Web server running on ${host}:${port}`,
      );
    });

    this.webServer.on("error", (error) => {
      console.error("Web server error:", error);
    });
  }

  async loadHandlers() {
    const handlers = [
      "events",
      "interactions",
    ];

    for (const handler of handlers) {
      try {
        const module = await import(
          `./handlers/loaders/${handler}.js`
        );

        if (typeof module.default === "function") {
          await module.default(this);
          console.log(`Loaded ${handler} handler.`);
        }
      } catch (error) {
        if (error.code === "ERR_MODULE_NOT_FOUND") {
          console.log(
            `Skipping ${handler} handler: file not found.`,
          );
          continue;
        }

        throw error;
      }
    }
  }

  async registerCommands() {
    try {
      await registerCommands(this, {
        clientId: config.bot.clientId,
      });

      console.log("Slash commands registered.");
    } catch (error) {
      console.error(
        "Failed to register slash commands:",
        error,
      );
    }
  }

  async shutdown(reason = "UNKNOWN") {
    console.log(
      `Shutting down LEGACY STORE BOT (${reason})...`,
    );

    try {
      if (this.webServer) {
        await new Promise((resolve) => {
          this.webServer.close(resolve);
        });
      }

      if (this.isReady()) {
        this.destroy();
      }

      console.log("LEGACY STORE BOT stopped.");
      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error);
      process.exit(1);
    }
  }
}

const bot = new LegacyStoreBot();

process.on("SIGINT", () => {
  bot.shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  bot.shutdown("SIGTERM");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  bot.shutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

bot.start();

export default LegacyStoreBot;
