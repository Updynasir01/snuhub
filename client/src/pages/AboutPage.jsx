import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Alex Kim', role: 'Founder & Editor-in-Chief', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Maria Lopez', role: 'Community Manager', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Jordan Smith', role: 'Lead Developer', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6faff] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10 text-center">
        <h1 className="text-4xl font-serif font-extrabold text-primary mb-4">About JournoHub</h1>
        <p className="text-lg text-primary-dark mb-8">
          <span className="font-bold text-accent">JournoHub</span> is a modern digital newsroom built for student journalists. Our mission is to empower the next generation of storytellers with the tools, community, and inspiration they need to make an impact.
        </p>
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-primary mb-2">Our Mission</h2>
          <p className="text-primary-dark mb-4">
            We believe every student has a voice worth sharing. JournoHub provides a platform to write, publish, and grow as a journalist—whether you're reporting campus news, sharing opinions, or investigating important issues.
          </p>
          <blockquote className="italic text-accent text-lg border-l-4 border-accent pl-4 mx-auto max-w-xl">
            "Journalism is the first rough draft of history."
            <span className="block text-sm text-primary-dark mt-2">- Philip L. Graham</span>
          </blockquote>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-primary mb-4">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full border-4 border-accent shadow mb-2 object-cover" />
                <span className="font-bold text-primary">{member.name}</span>
                <span className="text-primary-dark text-sm">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-full bg-accent text-white font-bold shadow-lg hover:bg-accent-light transition-colors text-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 