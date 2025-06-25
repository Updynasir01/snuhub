import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProfileEditor() {
  const { currentUser, setCurrentUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    year: '',
    faculty: '',
    profilePicture: '',
    awards: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        year: currentUser.year || '',
        faculty: currentUser.faculty || '',
        profilePicture: currentUser.profilePicture || '',
        awards: currentUser.awards || [],
      });
      setLoading(false);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAwardChange = (index, e) => {
    const { name, value } = e.target;
    const newAwards = [...profile.awards];
    newAwards[index][name] = value;
    setProfile(prev => ({ ...prev, awards: newAwards }));
  };

  const addAward = () => {
    setProfile(prev => ({
      ...prev,
      awards: [...prev.awards, { title: '', year: '', description: '' }],
    }));
  };

  const removeAward = (index) => {
    const newAwards = [...profile.awards];
    newAwards.splice(index, 1);
    setProfile(prev => ({ ...prev, awards: newAwards }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/api/upload', formData);
      setProfile(prev => ({ ...prev, profilePicture: res.data.url }));
    } catch (err) {
      setError('Failed to upload image.');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await axios.patch(`/api/users/${currentUser._id}`, profile);
      setCurrentUser(res.data);
      setError('');
    } catch (err) {
      setError('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="bg-white rounded-2xl shadow p-8 mt-12">
      <h2 className="text-2xl font-bold text-primary mb-6">Edit Your Profile</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input type="file" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" />
          {profile.profilePicture && <img src={profile.profilePicture} alt="Profile" className="mt-4 rounded-full h-24 w-24 object-cover" />}
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea name="bio" id="bio" value={profile.bio} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
          <input type="text" name="year" id="year" value={profile.year} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">Faculty</label>
          <input type="text" name="faculty" id="faculty" value={profile.faculty} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Awards & Recognitions</h3>
          {profile.awards.map((award, index) => (
            <div key={index} className="mt-4 p-4 border rounded-md space-y-2">
              <input type="text" name="title" value={award.title} onChange={(e) => handleAwardChange(index, e)} placeholder="Award Title" className="block w-full rounded-md border-gray-300 shadow-sm" />
              <input type="text" name="year" value={award.year} onChange={(e) => handleAwardChange(index, e)} placeholder="Year" className="block w-full rounded-md border-gray-300 shadow-sm" />
              <textarea name="description" value={award.description} onChange={(e) => handleAwardChange(index, e)} placeholder="Description" rows="2" className="block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              <button onClick={() => removeAward(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-5 w-5" /></button>
            </div>
          ))}
          <button onClick={addAward} className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-light">
            <PlusIcon className="h-5 w-5 mr-2" /> Add Award
          </button>
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-light">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
} 