import { useState } from 'react'
import { PlannerProvider } from './context/PlannerContext';
import Dashboard from './components/Dashboard';
import DailyPlan from './components/DailyPlan';
import AddSubjectForm from './components/AddSubjectForm';
import { Plus, LayoutDashboard, ListTodo } from 'lucide-react';

function App() {
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'daily'
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <PlannerProvider>
            <div className="app-container">
                <header className="app-header">
                    <div className="logo">
                        <h1>Smart Study</h1>
                    </div>
                    <nav className="app-nav">
                        <button
                            className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setView('dashboard')}
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </button>
                        <button
                            className={`nav-item ${view === 'daily' ? 'active' : ''}`}
                            onClick={() => setView('daily')}
                        >
                            <ListTodo size={20} />
                            <span>Daily Plan</span>
                        </button>
                    </nav>
                </header>

                <main className="main-content">
                    {view === 'dashboard' ? (
                        <Dashboard onAddSubject={() => setShowAddModal(true)} />
                    ) : (
                        <DailyPlan />
                    )}
                </main>

                {/* FAB Removed in favor of primary button in Dashboard */}

                {showAddModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <AddSubjectForm onClose={() => setShowAddModal(false)} />
                        </div>
                    </div>
                )}            </div>
        </PlannerProvider>
    )
}

export default App
