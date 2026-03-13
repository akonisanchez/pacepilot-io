import { useState } from 'react';
import PlanForm from './components/PlanForm';

function App() {
  const [submittedPlanData, setSubmittedPlanData] = useState(null);

  /*
    This function receives the completed form data
    from PlanForm and stores it in App state.
  */
  function handleGeneratePlan(formData) {
    setSubmittedPlanData(formData);
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>PacePilot.io</h1>
        <p>Your flexible weekly running plan generator.</p>
      </header>

      <PlanForm onGeneratePlan={handleGeneratePlan} />

      {submittedPlanData && (
        <section className="results-card">
          <h2>Submitted Plan Preferences</h2>
          <ul>
            <li>
              <strong>Current weekly mileage:</strong>{' '}
              {submittedPlanData.weeklyMileage}
            </li>
            <li>
              <strong>Preferred run days:</strong> {submittedPlanData.runDays}
            </li>
            <li>
              <strong>Experience level:</strong>{' '}
              {submittedPlanData.experienceLevel}
            </li>
            <li>
              <strong>Training goal:</strong> {submittedPlanData.goal}
            </li>
            <li>
              <strong>Long run preference:</strong>{' '}
              {submittedPlanData.longRunPreference}
            </li>
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;