import "dotenv/config";

export const botConfig = {
  brand: {
    name: "LEGACY STORE",
    version: "V1",
    footer: "LEGACY STORE • V1",

    colors: {
      primary: "#5865F2",
      success: "#57F287",
      danger: "#ED4245",
      warning: "#FEE75C",
      info: "#3498DB",
      dark: "#111318",
      gold: "#F1C40F",
    },
  },

  presence: {
    status: "online",
    activity: {
      name: "LEGACY STORE",
      type: 3,
    },
  },

  commands: {
    prefix: process.env.PREFIX || "!",
    cooldown: 3,

    owners: (process.env.OWNER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  },

  moderation: {
    enabled: true,

    spam: {
      enabled: true,
      maxMessages: 6,
      windowMs: 5000,
      timeoutMs: 60 * 1000,
    },

    badWords: {
      enabled: true,

      words: [
        "fuck",
        "shit",
        "bitch",
      ],

      timeoutMs: 60 * 1000,
    },

    kick: true,
    ban: true,
    timeout: true,
  },

  welcome: {
    enabled: true,
    channelId: process.env.WELCOME_CHANNEL_ID || null,

    message:
      "👋 Welcome {user} to **{server}**!\n" +
      "You are member **#{count}**.",
  },

  leave: {
    enabled: true,
    channelId: process.env.LEAVE_CHANNEL_ID || null,

    message:
      "👋 **{user}** has left **{server}**.\n" +
      "We now have **{count}** members.",
  },

  invites: {
    enabled: true,
  },

  tickets: {
    enabled: true,
    categoryId: process.env.TICKET_CATEGORY_ID || null,
    supportRoleId: process.env.SUPPORT_ROLE_ID || null,
  },

  shop: {
    enabled: true,
    currency: "BDT",
  },

  orders: {
    enabled: true,
  },

  payments: {
    enabled: true,

    bkash: process.env.BKASH_NUMBER || "",
    nagad: process.env.NAGAD_NUMBER || "",
    rocket: process.env.ROCKET_NUMBER || "",
  },

  reviews: {
    enabled: true,
  },

  customerHistory: {
    enabled: true,
  },

  giveaways: {
    enabled: true,

    minimumDuration: 60 * 1000,
    maximumDuration: 30 * 24 * 60 * 60 * 1000,

    minimumWinners: 1,
    maximumWinners: 20,
  },

  announcements: {
    enabled: true,
  },

  verification: {
    enabled: true,

    verifiedRoleId:
      process.env.VERIFIED_ROLE_ID || null,

    channelId:
      process.env.VERIFICATION_CHANNEL_ID || null,
  },

  logs: {
    enabled: true,
    channelId: process.env.LOG_CHANNEL_ID || null,
  },

  autoReply: {
    enabled: true,
  },

  faq: {
    enabled: true,
  },

  autoReact: {
    enabled: true,
  },

  customEmbeds: {
    enabled: true,
  },

  minecraft: {
    enabled: true,

    serverIp:
      process.env.MC_SERVER_IP ||
      "play.legacy-store.net",
  },

  features: {
    shop: true,
    products: true,
    pricing: true,
    orders: true,
    payments: true,

    tickets: true,
    reviews: true,
    vouch: true,
    customerHistory: true,

    welcome: true,
    leave: true,
    invites: true,

    giveaways: true,
    announcements: true,
    verification: true,
    logs: true,

    moderation: true,
    autoReply: true,
    faq: true,
    autoReact: true,
    customEmbeds: true,

    minecraft: true,
    cape: true,
    redeem: true,
  },
};

export function isOwner(userId) {
  return config.bot.owners.includes(String(userId));
}

export function isFeatureEnabled(feature) {
  return config.features[feature] !== false;
}

export function getColor(name = "primary") {
  const hex =
    config.brand.colors[name] ||
    config.brand.colors.primary;

  return parseInt(hex.replace("#", ""), 16);
}

export function replaceVariables(text, data = {}) {
  return String(text).replace(
    /\{(\w+)\}/g,
    (_, key) => data[key] ?? `{${key}}`,
  );
}

export function validateConfig() {
  const errors = [];

  if (!config.bot.token) {
    errors.push(
      "DISCORD_TOKEN or TOKEN is missing.",
    );
  }

  if (!config.bot.clientId) {
    errors.push(
      "CLIENT_ID is missing.",
    );
  }

  return errors;
}

export const config = {
  bot: {
    token:
      process.env.DISCORD_TOKEN ||
      process.env.TOKEN,

    clientId:
      process.env.CLIENT_ID,

    owners:
      botConfig.commands.owners,

    prefix:
      botConfig.commands.prefix,
  },

  brand: botConfig.brand,
  moderation: botConfig.moderation,
  welcome: botConfig.welcome,
  leave: botConfig.leave,
  invites: botConfig.invites,
  tickets: botConfig.tickets,
  shop: botConfig.shop,
  orders: botConfig.orders,
  payments: botConfig.payments,
  reviews: botConfig.reviews,
  customerHistory: botConfig.customerHistory,
  giveaways: botConfig.giveaways,
  announcements: botConfig.announcements,
  verification: botConfig.verification,
  logs: botConfig.logs,
  autoReply: botConfig.autoReply,
  faq: botConfig.faq,
  autoReact: botConfig.autoReact,
  customEmbeds: botConfig.customEmbeds,
  minecraft: botConfig.minecraft,
  features: botConfig.features,
};

export default botConfig;
