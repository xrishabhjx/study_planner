import { usePlanner } from '../context/PlannerContext';
import { getDaysRemaining, formatDate } from '../utils/dateUtils';
import { Trash2, BookOpen, Calendar, TrendingUp } from 'lucide-react';

export default function Dashboard({ onAddSubject }) {
    const { subjects, deleteSubject } = usePlanner();

    const totalChapters = subjects.reduce((acc, s) => acc + s.totalChapters, 0);
    const totalCompleted = subjects.reduce((acc, s) => acc + s.completedChapters, 0);
    const overallProgress = totalChapters > 0 ? Math.round((totalCompleted / totalChapters) * 100) : 0;

    // Calculate total daily hours needed
    const totalDailyHours = subjects.reduce((acc, s) => {
        const daysLeft = getDaysRemaining(s.examDate);
        if (s.completedChapters >= s.totalChapters) return acc;
        const remaining = s.totalChapters - s.completedChapters;
        // Default to 1 hour/chapter if not specified
        const hoursPerCh = s.hoursPerChapter || 1;
        // If daysLeft <= 0 (Today or Overdue), assume we need to do everything today (divisor 1)
        const divisor = daysLeft <= 0 ? 1 : daysLeft;
        const dailyCh = Math.ceil(remaining / divisor);
        return acc + (dailyCh * hoursPerCh);
    }, 0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning, Scholar!';
        if (hour < 18) return 'Good Afternoon, Scholar!';
        return 'Good Evening, Scholar!';
    };

    const quotes = [
        "The secret of getting ahead is getting started.",
        "It always seems impossible until it's done.",
        "Don't watch the clock; do what it does. Keep going.",
        "Success is the sum of small efforts, repeated daily."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    const getDaysBadge = (days) => {
        if (days < 0) return { text: 'Overdue', color: '#ef4444', bg: '#fee2e2' };
        if (days === 0) return { text: 'Today', color: '#f59e0b', bg: '#fef3c7' };
        if (days === 1) return { text: 'Tomorrow', color: '#f59e0b', bg: '#fef3c7' };
        if (days < 7) return { text: `${days} Days Left`, color: '#ef4444', bg: '#fee2e2' };
        return { text: `${days} Days Left`, color: '#0ea5e9', bg: '#e0f2fe' };
    };

    return (
        <div className="dashboard">
            <div className="welcome-header">
                <div>
                    <h1>{getGreeting()}</h1>
                    <p className="quote">"{randomQuote}"</p>
                </div>
                <button onClick={onAddSubject} className="primary-btn">
                    + Add Subject
                </button>
            </div>

            <div className="dashboard-header">
                <div className="stat-card main-stat">
                    <div className="stat-icon"><TrendingUp size={24} strokeWidth={1.5} /></div>
                    <div className="stat-info">
                        <h3>Overall Progress</h3>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${overallProgress}%` }}></div>
                        </div>
                        <span>{overallProgress}% Completed</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon"><BookOpen size={24} strokeWidth={1.5} /></div>
                    <div className="stat-info">
                        <h3>Daily Load</h3>
                        <span className="stat-value">{totalDailyHours} hrs</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>Estimated Study Time</span>
                    </div>
                </div>
            </div>

            <h2>Your Subjects</h2>

            {subjects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <BookOpen size={48} color="#cbd5e1" strokeWidth={1.5} />
                    </div>
                    <h3>Start Your Journey</h3>
                    <p style={{ maxWidth: '400px', margin: '0.5rem auto', lineHeight: '1.6' }}>
                        Welcome! It looks like you haven't added any subjects yet.
                        Click the button below to add your first exam or topic, and we'll create a custom study schedule just for you.
                    </p>
                    <button onClick={onAddSubject} className="primary-btn" style={{ marginTop: '1rem' }}>
                        + Add First Subject
                    </button>
                </div>
            ) : (
                <div className="subject-grid">
                    {subjects.map(subject => {
                        const daysLeft = getDaysRemaining(subject.examDate);
                        const progress = Math.round((subject.completedChapters / subject.totalChapters) * 100);
                        const badge = getDaysBadge(daysLeft);

                        return (
                            <div key={subject.id} className="subject-card" style={{ borderTopColor: subject.color }}>
                                <div className="card-header">
                                    <h3 style={{ color: subject.color }}>{subject.name}</h3>
                                    <span className="exam-date">
                                        <Calendar size={14} strokeWidth={1.5} /> {formatDate(subject.examDate)}
                                    </span>
                                </div>

                                <div className="card-body">
                                    <div className="progress-section">
                                        <div className="progress-labels">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="progress-bar-container sm">
                                            <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: subject.color }}></div>
                                        </div>
                                        <div className="chapter-count">
                                            {subject.completedChapters} / {subject.totalChapters} Chapters
                                            {subject.hoursPerChapter && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', opacity: 0.7 }}> (~{subject.hoursPerChapter}h/ch)</span>}
                                        </div>
                                    </div>

                                    <div className="days-badge" style={{
                                        backgroundColor: badge.bg,
                                        color: badge.color
                                    }}>
                                        {badge.text}
                                    </div>
                                </div>

                                <button onClick={() => deleteSubject(subject.id)} className="delete-btn" aria-label="Delete subject">
                                    <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
