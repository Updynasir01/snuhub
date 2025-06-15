const mongoose = require('mongoose');
const Article = require('./models/Article');
const User = require('./models/User');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    // Clear existing articles and users (optional, for fresh seed)
    await Article.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing articles and users');

    // Create a dummy user for articles
    const dummyUser = new User({
      name: 'JournoHub Admin',
      email: 'admin@journohub.com',
      password: 'password123', // In a real app, hash this!
      role: 'admin',
    });
    await dummyUser.save();
    console.log('Dummy user created', dummyUser);

    const articles = [
      {
        title: 'The Future of AI in Journalism',
        content: 'Artificial intelligence is rapidly changing the landscape of journalism, offering new tools for data analysis, content generation, and personalized news delivery. While it presents exciting opportunities for efficiency and innovation, it also raises ethical questions about accuracy, bias, and the role of human journalists. Striking a balance between technological advancement and journalistic integrity will be crucial for the future of the industry.',
        author: dummyUser._id,
        status: 'published',
        tags: ['AI', 'Technology', 'Future'],
        image: 'https://images.unsplash.com/photo-1579547620713-162e0d37e23b?auto=format&fit=crop&q=80&w=1740'
      },
      {
        title: 'Student Voices: Reporting on Climate Change',
        content: 'Student journalists worldwide are taking a stand, using their platforms to report on the urgent issue of climate change. From local environmental initiatives to global policy debates, their stories highlight the impact on communities and inspire action. These young reporters are not just documenting history; they are actively shaping the conversation around one of humanity's greatest challenges.',
        author: dummyUser._id,
        status: 'published',
        tags: ['Climate Change', 'Environment', 'Student Journalism'],
        image: 'https://images.unsplash.com/photo-1469122312211-e67c87c98031?auto=format&fit=crop&q=80&w=1740'
      },
      {
        title: 'Investigative Journalism in the Digital Age',
        content: 'The digital age has transformed investigative journalism, providing new avenues for research and dissemination, but also introducing challenges like misinformation and data overload. Journalists now leverage open-source intelligence, data visualization, and collaborative platforms to uncover complex stories. Despite the evolving tools, the core principles of truth-seeking and accountability remain paramount.',
        author: dummyUser._id,
        status: 'published',
        tags: ['Investigative Journalism', 'Digital Media', 'Ethics'],
        image: 'https://images.unsplash.com/photo-1549490196-80512809e59a?auto=format&fit=crop&q=80&w=1740'
      },
      {
        title: 'The Power of Photojournalism: Capturing Moments of Truth',
        content: 'Photojournalism continues to be a vital form of storytelling, capable of conveying powerful narratives and evoking profound emotions through a single image. In an era of abundant visual content, the integrity and impact of a photojournalist's work are more crucial than ever. Their lenses capture raw reality, human experiences, and historical moments, making the unseen visible and giving a voice to the voiceless.',
        author: dummyUser._id,
        status: 'published',
        tags: ['Photojournalism', 'Visual Storytelling', 'Ethics'],
        image: 'https://images.unsplash.com/photo-1542475713-39d7367c3b28?auto=format&fit=crop&q=80&w=1740'
      },
    ];

    await Article.insertMany(articles);
    console.log('Articles seeded successfully!');

    mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 