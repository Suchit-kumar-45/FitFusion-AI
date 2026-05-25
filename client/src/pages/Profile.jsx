import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { updateProfile } from '../services/authService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/profile.css';

function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    gender: '',
    activityLevel: '',
    season: '',
    location: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        goal: user.goal || '',
        gender: user.gender || '',
        activityLevel: user.activityLevel || '',
        season: user.season || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.gender) {
      setError('Name and Gender are required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await updateProfile(formData);
      updateUser(response.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        goal: user.goal || '',
        gender: user.gender || '',
        activityLevel: user.activityLevel || '',
        season: user.season || '',
        location: user.location || '',
      });
    }
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        
        <div className="profile-container">
          <h1>My Profile</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="profile-card">
            {!isEditing ? (
              <>
                <div className="profile-info">
                  <div className="info-item">
                    <label>Name</label>
                    <p>{user?.name || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{user?.email || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Age</label>
                    <p>{user?.age || 'Not set'} years</p>
                  </div>
                  <div className="info-item">
                    <label>Height</label>
                    <p>{user?.height || 'Not set'} cm</p>
                  </div>
                  <div className="info-item">
                    <label>Weight</label>
                    <p>{user?.weight || 'Not set'} kg</p>
                  </div>
                  <div className="info-item">
                    <label>Gender</label>
                    <p>{user?.gender || 'Not set'}</p>
                  </div>
                  <div className="info-item">
                    <label>Fitness Goal</label>
                    <p>{user?.goal || 'Not set'}</p>
                  </div>
                  <div className="info-item">
                    <label>Activity Level</label>
                    <p>{user?.activityLevel || 'Not set'}</p>
                  </div>
                  <div className="info-item">
                    <label>Daily Calorie Target</label>
                    <p>{user?.dailyCalories || 2000} kcal</p>
                  </div>
                  <div className="info-item">
                    <label>Season</label>
                    <p>{user?.season || 'Not set'}</p>
                  </div>
                  <div className="info-item">
                    <label>Location</label>
                    <p>{user?.location || 'Not set'}</p>
                  </div>
                  <div className="info-item water-info">
                    <label>Daily Water Goal 💧</label>
                    <p className="water-goal">{user?.waterGoal || 3.5}L</p>
                    <small>Personalized based on weight, activity, and season</small>
                  </div>
                </div>

                <button 
                  className="btn btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="1"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    {!formData.gender && <option value="">Select gender</option>}
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="goal">Fitness Goal</label>
                  <select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                  >
                    <option value="">Select a goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Flexibility">Flexibility</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="activityLevel">Activity Level</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select activity level</option>
                    <option value="Sedentary">Sedentary (Little or no exercise)</option>
                    <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                    <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                    <option value="Very Active">Very Active (6-7 days/week)</option>
                    <option value="Extremely Active">Extremely Active (Training twice/day)</option>
                  </select>
                  <small>This helps calculate your personalized daily calorie target</small>
                </div>

                <div className="form-group">
                  <label htmlFor="season">Current Season</label>
                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                  >
                    <option value="">Select season</option>
                    <option value="Summer">Summer (Hot & Humid)</option>
                    <option value="Winter">Winter (Cold)</option>
                    <option value="Rainy">Rainy (Monsoon)</option>
                    <option value="Spring">Spring (Mild)</option>
                  </select>
                  <small>Used to adjust your personalized water intake goal</small>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai, Delhi, Bangalore"
                  />
                  <small>For climate-based health recommendations</small>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit"
                    className="btn btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-cancel"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
