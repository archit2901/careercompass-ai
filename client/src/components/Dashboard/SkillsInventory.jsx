import { useState, useEffect } from 'react';
import profileService from '../../services/profileService';
import './SkillsInventory.css';

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: '#94a3b8' },
  { value: 'intermediate', label: 'Intermediate', color: '#60a5fa' },
  { value: 'advanced', label: 'Advanced', color: '#818cf8' },
  { value: 'expert', label: 'Expert', color: '#10b981' }
];

const SKILL_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'tools', label: 'Tools' },
  { value: 'languages', label: 'Languages' },
  { value: 'frameworks', label: 'Frameworks' },
  { value: 'other', label: 'Other' }
];

const SkillsInventory = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New skill form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency: 'beginner',
    yearsOfExperience: 0,
    category: 'technical'
  });
  const [addingSkill, setAddingSkill] = useState(false);

  // Edit skill state
  const [editingSkill, setEditingSkill] = useState(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    
    if (!newSkill.name.trim()) {
      setError('Skill name is required');
      return;
    }

    setAddingSkill(true);
    setError('');

    try {
      const response = await profileService.addSkill(newSkill);
      setProfile(response.data);
      setNewSkill({
        name: '',
        proficiency: 'beginner',
        yearsOfExperience: 0,
        category: 'technical'
      });
      setShowAddForm(false);
      setSuccess('Skill added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleUpdateSkill = async (skillId, updates) => {
    try {
      const response = await profileService.updateSkill(skillId, updates);
      setProfile(response.data);
      setEditingSkill(null);
      setSuccess('Skill updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) {
      return;
    }

    try {
      const response = await profileService.deleteSkill(skillId);
      setProfile(response.data);
      setSuccess('Skill removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove skill');
    }
  };

  const getProficiencyColor = (proficiency) => {
    const level = PROFICIENCY_LEVELS.find(l => l.value === proficiency);
    return level?.color || '#94a3b8';
  };

  if (loading) {
    return (
      <div className="skills-loading">
        <div className="loading-spinner" />
        <p>Loading skills...</p>
      </div>
    );
  }

  const skills = profile?.skills || [];

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="skills-inventory">
      <div className="skills-header">
        <div>
          <h2>Skills Inventory</h2>
          <p>Track your professional skills and expertise levels</p>
        </div>
        <button 
          className="add-skill-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Skill
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Add Skill Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add New Skill</h3>
            <form onSubmit={handleAddSkill}>
              <div className="form-group">
                <label>Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g., JavaScript, Project Management"
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newSkill.category}
                    onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                  >
                    {SKILL_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Proficiency</label>
                  <select
                    value={newSkill.proficiency}
                    onChange={e => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                  >
                    {PROFICIENCY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={newSkill.yearsOfExperience}
                  onChange={e => setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={addingSkill}>
                  {addingSkill ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skills Display */}
      {skills.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No skills added yet</h3>
          <p>Start building your skills inventory to get personalized career recommendations</p>
          <button className="add-skill-btn" onClick={() => setShowAddForm(true)}>
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="skills-grid">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="skill-category">
              <h3 className="category-title">
                {SKILL_CATEGORIES.find(c => c.value === category)?.label || 'Other'}
                <span className="skill-count">{categorySkills.length}</span>
              </h3>
              <div className="skills-list">
                {categorySkills.map(skill => (
                  <div key={skill._id} className="skill-card">
                    {editingSkill === skill._id ? (
                      <EditSkillForm
                        skill={skill}
                        onSave={(updates) => handleUpdateSkill(skill._id, updates)}
                        onCancel={() => setEditingSkill(null)}
                      />
                    ) : (
                      <>
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span 
                            className="skill-proficiency"
                            style={{ backgroundColor: getProficiencyColor(skill.proficiency) }}
                          >
                            {skill.proficiency}
                          </span>
                        </div>
                        {skill.yearsOfExperience > 0 && (
                          <span className="skill-years">
                            {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                          </span>
                        )}
                        <div className="skill-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => setEditingSkill(skill._id)}
                            title="Edit skill"
                          >
                            ✏️
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteSkill(skill._id)}
                            title="Remove skill"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Summary */}
      {skills.length > 0 && (
        <div className="skills-summary">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-value">{skills.length}</span>
              <span className="stat-label">Total Skills</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {skills.filter(s => s.proficiency === 'expert' || s.proficiency === 'advanced').length}
              </span>
              <span className="stat-label">Advanced+</span>
            </div>
            <div className="stat">
              <span className="stat-value">{Object.keys(groupedSkills).length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Skill Form Component
const EditSkillForm = ({ skill, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: skill.name,
    proficiency: skill.proficiency,
    yearsOfExperience: skill.yearsOfExperience,
    category: skill.category
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="edit-skill-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        className="edit-name-input"
      />
      <select
        value={formData.proficiency}
        onChange={e => setFormData({ ...formData, proficiency: e.target.value })}
        className="edit-select"
      >
        {PROFICIENCY_LEVELS.map(level => (
          <option key={level.value} value={level.value}>{level.label}</option>
        ))}
      </select>
      <div className="edit-actions">
        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default SkillsInventory;