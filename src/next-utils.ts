import next from "next";

const PORT = Number(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV !== "production";

export const nextApp = next({ 
    dev,
    port : PORT,
});

export const nextHandler = nextApp.getRequestHandler();