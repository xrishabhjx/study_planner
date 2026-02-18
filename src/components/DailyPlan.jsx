import { useState, useEffect } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { getDaysRemaining, calculateDailyGoal } from '../utils/dateUtils';
import { CheckCircle, Circle, RefreshCw } from 'lucide-react';

export default function DailyPlan() {
    const { subjects, updateProgress } = usePlanner();

    // Create a local state to track "checked" items for visual feedback before syncing?
    // Actually, we can just sync directly with context for simplicity, 
    // but "Complete 2 chapters" is a bit abstract to check off one by one if the goal is > 1.
    // For this MVP, we'll show "Goal: X chapters". And simple +/- buttons to log progress today.

    const plan = subjects.map(subject => {
        const daysLeft = getDaysRemaining(subject.examDate);
        const goal = calculateDailyGoal(subject.totalChapters, subject.completedChapters, daysLeft);
        return { ...subject, goal, daysLeft };
    }).filter(s => s.goal > 0);

    // We want to track "progress made today" separately from total progress?
    // For MVP, we just verify "Did you study?"
    // Let's allow users to increment their `completedChapters` directly here.

    const handleIncrement = (id, current, total) => {
        if (current < total) {
            updateProgress(id, current + 1);
        }
    };

    return (
        <div className="daily-plan">
            <div className="section-header">
                <h2>Today's Plan</h2>
                <span className="date-badge">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>

            {subjects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <RefreshCw size={48} color="#cbd5e1" strokeWidth={1.5} />
                    </div>
                    <h3>Your plan is waiting</h3>
                    <p style={{ maxWidth: '400px', margin: '0.5rem auto' }}>Add subjects in the Dashboard to see your daily tasks here.</p>
                </div>
            ) : plan.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <CheckCircle size={48} color="#cbd5e1" strokeWidth={1.5} />
                    </div>
                    <h3>All caught up!</h3>
                    <p style={{ maxWidth: '400px', margin: '0.5rem auto' }}>No study tasks for today. Take a break or add more subjects!</p>
                    <p className="subtext">"Rest is also part of the work."</p>
                </div>
            ) : (
                <div className="task-list">
                    {plan.map(item => (
                        <div key={item.id} className="task-card" style={{ '--task-color': item.color }}>
                            <div className="task-info">
                                <div className="task-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3>{item.name}</h3>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.color }}>
                                        {Math.round((item.completedChapters / item.totalChapters) * 100)}%
                                    </span>
                                </div>

                                <div className="task-meta">
                                    <span>Goal: <strong>{item.goal}</strong> chapters</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>~{item.goal * (item.hoursPerChapter || 1)} hrs</span>
                                </div>

                                <div className="task-progress-area">
                                    <div className="progress-bar-container" style={{ height: '8px', margin: '0 0 0.5rem' }}>
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${Math.round((item.completedChapters / item.totalChapters) * 100)}%`,
                                                backgroundColor: item.color
                                            }}
                                        ></div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                                        {item.completedChapters} / {item.totalChapters} completed
                                    </div>
                                </div>
                            </div>

                            <div className="task-actions">
                                <button
                                    className="primary-btn"
                                    onClick={() => handleIncrement(item.id, item.completedChapters, item.totalChapters)}
                                    disabled={item.completedChapters >= item.totalChapters}
                                >
                                    {item.completedChapters >= item.totalChapters ? (
                                        <>
                                            <CheckCircle size={16} strokeWidth={2} />
                                            <span>Completed</span>
                                        </>
                                    ) : (
                                        <>
                                            <Circle size={16} strokeWidth={2} />
                                            <span>Mark 1 Chapter Done</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
