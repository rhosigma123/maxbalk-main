const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true, default: "None" },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    newsOrEvent: {
        type: String,
        enum: ["News", "Event"],
        required: true,
        default: "News",
    },
    image: { type: String, required: false, default: "Miss ME", useImage: true },
    banner: { type: String, required: false, default: "None", useImage: true },
    images: { type: String, required: false, default: "Miss ME", useImages: true },
    description: { type: String, required: false, default: "None", useTextarea: true },
    content: { type: String, required: false, default: "None", useEditor: true },
    slug: { type: String, required: false, default: "None" },
    metaTitle: { type: String, required: false, default: "None" },
    metaDescription: { type: String, required: false, default: "None", useTextarea: true },
    indexing: {
        type: String,
        enum: ["max-image-preview:large, max-snippet:-1, max-video-preview:-1", "noindex", "noindex, follow", "nofollow", "noindex, nofollow"],
        required: false,
        default: "max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    newsSchema: { type: String, required: false, default: "None", useTextarea: true },
    action: {
        type: String,
        enum: ["Draft", "Publish"],
        required: true,
        default: "Draft",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
    }
}, { timestamps: {} });

const NewsEvent = mongoose.model('NewsEvent', newsSchema);

module.exports = NewsEvent;
