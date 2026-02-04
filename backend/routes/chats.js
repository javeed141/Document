const express = require("express");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");
const { generateAIResponse } = require("../services/ai_service");

const router = express.Router();

/* CREATE CHAT */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Check if chat with same title already exists for this user
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

    // Create new chat
    const chat = await Chat.create({
      userId: req.user.userId,
      title,
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error("❌ Create chat error:", error);
    res.status(500).json({ message: "Failed to create chat" });
  }
});

/* LIST USER CHATS */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const chats = await Chat.find({ userId: req.user.userId })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Chat.countDocuments({ userId: req.user.userId });

    res.json({
      chats,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("❌ List chats error:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
});

/* GET CHAT + MESSAGES */
router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user.userId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    res.json({ chat, messages });
  } catch (error) {
    console.error("❌ Get chat error:", error);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
});

/* SEND MESSAGE */
router.post("/:chatId/messages", authMiddleware, async (req, res) => {
  try {
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

    // 1️⃣ Save user message
    await Message.create({
      chatId,
      role: "user",
      content: content.trim(),
    });

    // 2️⃣ Get conversation history (last 20 messages for context)
    const history = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(20);

    const formattedMessages = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // 3️⃣ Generate AI response
    let aiContent;
    try {
      aiContent = await generateAIResponse(formattedMessages);
    } catch (aiError) {
      console.error("❌ AI generation error:", aiError);
      aiContent = "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
    }

    // 4️⃣ Save AI message
    const aiMessage = await Message.create({
      chatId,
      role: "assistant",
      content: aiContent,
    });

    // 5️⃣ Update chat timestamp
    chat.updatedAt = new Date();
    await chat.save();

    res.status(201).json(aiMessage);
  } catch (error) {
    console.error("❌ Send message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* UPDATE CHAT TITLE */
router.put("/:chatId", authMiddleware, async (req, res) => {
  try {
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
  } catch (error) {
    console.error("❌ Update chat error:", error);
    res.status(500).json({ message: "Failed to update chat" });
  }
});

/* DELETE CHAT */
router.delete("/:chatId", authMiddleware, async (req, res) => {
  try {
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
  } catch (error) {
    console.error("❌ Delete chat error:", error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
});

module.exports = router;