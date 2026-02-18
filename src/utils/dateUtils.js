export function getDaysRemaining(examDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);

    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

export function calculateDailyGoal(total, completed, daysRemaining) {
    if (daysRemaining <= 0) return total - completed;
    const remainingChapters = total - completed;
    if (remainingChapters <= 0) return 0;
    return Math.ceil(remainingChapters / daysRemaining);
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
