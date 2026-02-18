import { createContext, useContext, useState, useEffect } from 'react';

const PlannerContext = createContext();

export function usePlanner() {
    return useContext(PlannerContext);
}

export function PlannerProvider({ children }) {
    const [subjects, setSubjects] = useState(() => {
        const saved = localStorage.getItem('study-planner-subjects');
        if (saved) return JSON.parse(saved);

        // Demo Data for new users
        const demoData = [
            {
                id: 'demo-1',
                name: 'Mathematics',
                examDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
                totalChapters: 12,
                completedChapters: 4,
                hoursPerChapter: 2,
                color: '#6366f1' // Indigo
            },
            {
                id: 'demo-2',
                name: 'History',
                examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
                totalChapters: 20,
                completedChapters: 2,
                hoursPerChapter: 1.5,
                color: '#f59e0b' // Amber
            }
        ];
        // Don't save to localStorage immediately to allow "reset" on refresh if they don't change anything? 
        // Actually better to save it so it persists.
        return demoData;
    });

    useEffect(() => {
        localStorage.setItem('study-planner-subjects', JSON.stringify(subjects));
    }, [subjects]);

    const addSubject = (subject) => {
        setSubjects(prev => [...prev, { ...subject, id: crypto.randomUUID(), completedChapters: 0 }]);
    };

    const deleteSubject = (id) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
    };

    const updateProgress = (id, newCompleted) => {
        setSubjects(prev => prev.map(s =>
            s.id === id ? { ...s, completedChapters: Math.min(s.totalChapters, Math.max(0, newCompleted)) } : s
        ));
    };

    const value = {
        subjects,
        addSubject,
        deleteSubject,
        updateProgress
    };

    return (
        <PlannerContext.Provider value={value}>
            {children}
        </PlannerContext.Provider>
    );
}
