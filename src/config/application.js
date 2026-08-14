import "dotenv/config";

export const config = {
  bot: {
    token: process.env.DISCORD_TOKEN || process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    ownerIds: (process.env.OWNER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),

    prefix: process.env.PREFIX || "!",
  },

  brand: {
    name: "LEGACY STORE",
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

  moderation: {
    spam: {
      enabled: true,
      maxMessages: 6,
      windowMs: 5000,
      timeoutMs: 60 * 1000,
    },

    badWords: {
      enabled: true,

      // নিজের server অনুযায়ী শব্দ এখানে যোগ করবি।
      words: [
        "fuck",
        "shit",
        "bitch",
      ],

      timeoutMs: 60 * 1000,
    },
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

  logs: {
    enabled: true,
    channelId: process.env.LOG_CHANNEL_ID || null,
  },

  verification: {
    enabled: true,
    verifiedRoleId: process.env.VERIFIED_ROLE_ID || null,
    channelId: process.env.VERIFICATION_CHANNEL_ID || null,
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

  payment: {
    bkash: process.env.BKASH_NUMBER || "",
    nagad: process.env.NAGAD_NUMBER || "",
    rocket: process.env.ROCKET_NUMBER || "",
  },

  giveaways: {
    enabled: true,
    minimumDuration: 60 * 1000,
    maximumDuration: 30 * 24 * 60 * 60 * 1000,
  },

  minecraft: {
    enabled: true,
    serverIp: process.env.MC_SERVER_IP || "play.legacy-store.net",
  },

  features: {
    shop: true,
    orders: true,
    payments: true,
    tickets: true,
    reviews: true,
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
    minecraft: true,
    autoReact: true,
    customEmbeds: true,
  },
};

export function isOwner(userId) {
  return config.bot.ownerIds.includes(String(userId));
}

export function isFeatureEnabled(feature) {
  return config.features[feature] !== false;
}

export function color(name = "primary") {
  return parseInt(
    (config.brand.colors[name] || config.brand.colors.primary).replace("#", ""),
    16,
  );
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
    errors.push("DISCORD_TOKEN/TOKEN is missing");
  }

  if (!config.bot.clientId) {
    errors.push("CLIENT_ID is missing");
  }

  return errors;
}

export default config;
