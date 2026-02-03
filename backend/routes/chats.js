const express = require("express");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* CREATE CHAT */
router.post("/", authMiddleware, async (req, res) => {
  const title = req.body.title?.trim();

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // 1️⃣ Check if chat with same title already exists for this user
  const existingChat = await Chat.findOne({
    userId: req.user.userId,
    title: title,
  });

  if (existingChat) {
    return res.status(409).json({
      message: "Chat with this title already exists",
      chat: existingChat,
    });
  }

  // 2️⃣ Create new chat
  const chat = await Chat.create({
    userId: req.user.userId,
    title,
  });

  res.status(201).json(chat);
});


/* LIST USER CHATS */
router.get("/", authMiddleware, async (req, res) => {
  const chats = await Chat.find({ userId: req.user.userId })
    .sort({ updatedAt: -1 });

  res.json(chats);
});

/* GET CHAT + MESSAGES */
router.get("/:chatId", authMiddleware, async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findOne({
    _id: chatId,
    userId: req.user.userId,
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 });

  res.json({ chat, messages });
});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* SEND MESSAGE */
router.post("/:chatId/messages", authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  const chat = await Chat.findOne({
    _id: chatId,
    userId: req.user.userId,
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Save user message
  await Message.create({
    chatId,
    role: "user",
    content,
  });

  // ⏳ Artificial delay (1.5 seconds)
  await delay(2500);

  // 🤖 Mock AI response
  const aiMessage = await Message.create({
    chatId,
    role: "assistant",
    content: "This is a mock AI response.",
  });

  chat.updatedAt = new Date();
  await chat.save();

  res.status(201).json(aiMessage);
});

/* UPDATE CHAT TITLE */
router.put("/:chatId", authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const chat = await Chat.findOne({
    _id: chatId,
    userId: req.user.userId,
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  chat.title = title.trim();
  chat.updatedAt = new Date();
  await chat.save();

  res.json(chat);
});

/* DELETE CHAT */
router.delete("/:chatId", authMiddleware, async (req, res) => {
  const { chatId } = req.params;

  const chat = await Chat.findOne({
    _id: chatId,
    userId: req.user.userId,
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // Delete all messages in the chat
  await Message.deleteMany({ chatId });

  // Delete the chat
  await Chat.findByIdAndDelete(chatId);

  res.status(204).send();
});

module.exports = router;
