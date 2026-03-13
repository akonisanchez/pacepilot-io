import { useState } from 'react';
import PlanForm from './components/PlanForm';
import generatePlan from './utils/generatePlan';

function App() {
  const [submittedPlanData, setSubmittedPlanData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState([]);

  /*
    This function receives the form data,
    stores it for reference,
    and creates a generated training plan.
  */
  function handleGeneratePlan(formData) {
    setSubmittedPlanData(formData);

    const newPlan = generatePlan(formData);
    setGeneratedPlan(newPlan);
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
          <h2>Your Weekly Plan</h2>
          <ul>
            {generatedPlan.map((run, index) => (
              <li key={`${run.type}-${index}`}>
                <strong>{run.type}:</strong> {run.miles} miles
                <br />
                <span>{run.notes}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;