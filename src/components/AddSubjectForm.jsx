import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { Plus, X } from 'lucide-react';

export default function AddSubjectForm({ onClose }) {
    const { addSubject } = usePlanner();
    const [formData, setFormData] = useState({
        name: '',
        examDate: '',
        totalChapters: '',
        color: '#6366f1' // default indigo
    });

    const colors = [
        '#6366f1', // Indigo
        '#ec4899', // Pink
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#3b82f6', // Blue
        '#8b5cf6', // Violet
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.examDate || !formData.totalChapters) return;

        addSubject({
            name: formData.name,
            examDate: formData.examDate,
            totalChapters: parseInt(formData.totalChapters),
            hoursPerChapter: parseFloat(formData.hoursPerChapter) || 1,
            color: formData.color,
            completedChapters: 0
        });

        setFormData({ name: '', examDate: '', totalChapters: '', hoursPerChapter: '', color: '#6366f1' });
        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="add-subject-form">
            <div className="form-header">
                <h3>Add New Subject</h3>
                {onClose && <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}><X size={20} strokeWidth={1.5} /></button>}
            </div>

            <div className="form-group">
                <label>Subject Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mathematics"
                    required
                />
            </div>

            <div className="form-group">
                <label>Exam Date</label>
                <input
                    type="date"
                    value={formData.examDate}
                    onChange={e => setFormData({ ...formData, examDate: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <label>Total Chapters / Topics</label>
                <input
                    type="number"
                    min="1"
                    value={formData.totalChapters}
                    onChange={e => setFormData({ ...formData, totalChapters: e.target.value })}
                    placeholder="20"
                    required
                />
            </div>

            <div className="form-group">
                <label>Est. Hours per Chapter</label>
                <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.hoursPerChapter || ''}
                    onChange={e => setFormData({ ...formData, hoursPerChapter: e.target.value })}
                    placeholder="e.g. 2.5"
                    required
                />
            </div>

            <div className="form-group">
                <label>Color Tag</label>
                <div className="color-picker">
                    {colors.map(c => (
                        <button
                            key={c}
                            type="button"
                            className={`color-swatch ${formData.color === c ? 'selected' : ''}`}
                            style={{ backgroundColor: c }}
                            onClick={() => setFormData({ ...formData, color: c })}
                        />
                    ))}
                </div>
            </div>

            <button type="submit" className="submit-btn primary-btn" style={{ justifyContent: 'center' }}>
                <Plus size={18} strokeWidth={1.5} /> Add Subject
            </button>
        </form>
    );
}
