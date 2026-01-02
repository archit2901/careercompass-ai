import { useState } from 'react';
import analysisService from '../../services/analysisService';
import './JobAnalyzer.css';

const JobAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 50) {
      setError('Please enter a job description (at least 50 characters)');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await analysisService.analyzeJob(jobDescription);
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze job description');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'required': return '#ef4444';
      case 'preferred': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="job-analyzer">
      <div className="analyzer-header">
        <h2>🎯 Job Description Analyzer</h2>
        <p>Paste a job description to see how well you match and identify skill gaps</p>
      </div>

      <div className="analyzer-input">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here...

Example:
We are looking for a Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern CSS. The ideal candidate should have experience with state management (Redux/Zustand), testing frameworks, and CI/CD pipelines..."
          rows={8}
          disabled={loading}
        />
        <div className="input-footer">
          <span className="char-count">
            {jobDescription.length} characters
            {jobDescription.length < 50 && jobDescription.length > 0 && 
              ' (minimum 50)'}
          </span>
          <button 
            onClick={handleAnalyze} 
            disabled={loading || jobDescription.trim().length < 50}
            className="analyze-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              '✨ Analyze Job'
            )}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {analysis && (
        <div className="analysis-results">
          {/* Header with score */}
          <div className="results-header">
            <div className="job-info">
              <h3>{analysis.jobTitle || 'Job Analysis'}</h3>
              {analysis.company && <span className="company">{analysis.company}</span>}
            </div>
            <div 
              className="match-score"
              style={{ borderColor: getScoreColor(analysis.matchScore) }}
            >
              <span 
                className="score-value"
                style={{ color: getScoreColor(analysis.matchScore) }}
              >
                {analysis.matchScore}%
              </span>
              <span className="score-label">Match</span>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="assessment-card">
            <p>{analysis.overallAssessment}</p>
            {analysis.salaryInsight && (
              <p className="salary-insight">💰 {analysis.salaryInsight}</p>
            )}
          </div>

          {/* Skills Analysis */}
          <div className="skills-analysis">
            {/* Your Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="analysis-section strengths">
                <h4>✅ Your Strengths</h4>
                <ul>
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            {analysis.requiredSkills && analysis.requiredSkills.length > 0 && (
              <div className="analysis-section">
                <h4>📋 Required Skills</h4>
                <div className="skills-list">
                  {analysis.requiredSkills.map((skill, idx) => (
                    <div key={idx} className="skill-item">
                      <span className={`skill-status ${skill.candidateHas ? 'has' : 'missing'}`}>
                        {skill.candidateHas ? '✓' : '✗'}
                      </span>
                      <span className="skill-name">{skill.name}</span>
                      <span 
                        className="skill-importance"
                        style={{ backgroundColor: getImportanceColor(skill.importance) }}
                      >
                        {skill.importance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gaps */}
            {analysis.skillGaps && analysis.skillGaps.length > 0 && (
              <div className="analysis-section gaps">
                <h4>🎯 Skills to Develop</h4>
                <div className="gaps-list">
                  {analysis.skillGaps.map((gap, idx) => (
                    <div key={idx} className="gap-item">
                      <div className="gap-header">
                        <span className="gap-name">{gap.name}</span>
                        <span 
                          className="gap-importance"
                          style={{ backgroundColor: getImportanceColor(gap.importance) }}
                        >
                          {gap.importance}
                        </span>
                      </div>
                      <div className="gap-meta">
                        <span className={`difficulty ${gap.difficulty}`}>
                          {gap.difficulty} to learn
                        </span>
                        <span className="time">{gap.timeToLearn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="recommendations">
              <h4>💡 Recommendations</h4>
              <div className="recommendations-list">
                {analysis.recommendations.map((rec, idx) => (
                  <div key={idx} className={`recommendation priority-${rec.priority}`}>
                    <span className="priority-badge">{rec.priority}</span>
                    <p>{rec.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="results-actions">
            <button 
              className="action-btn secondary"
              onClick={() => {
                setAnalysis(null);
                setJobDescription('');
              }}
            >
              Analyze Another Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;