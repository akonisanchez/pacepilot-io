import { useEffect, useState } from 'react';
import PlanForm from './components/PlanForm';
import generatePlan from './utils/generatePlan';

function App() {
  const [submittedPlanData, setSubmittedPlanData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState([]);

  /*
    Initialize savedPlans from localStorage one time
    when the component first loads.
  */
  const [savedPlans, setSavedPlans] = useState(() => {
    const storedPlans = localStorage.getItem('pacepilot-saved-plans');

    if (!storedPlans) {
      return [];
    }

    return JSON.parse(storedPlans);
  });

  /*
    Save the current savedPlans array to localStorage
    whenever savedPlans changes.
  */
  useEffect(() => {
    localStorage.setItem('pacepilot-saved-plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

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

  /*
    Save the currently generated plan and its input settings
    into the savedPlans state array.
  */
  function handleSavePlan() {
    if (!submittedPlanData || generatedPlan.length === 0) {
      return;
    }

    const newSavedPlan = {
      id: crypto.randomUUID(),
      inputs: submittedPlanData,
      runs: generatedPlan,
    };

    setSavedPlans((previousSavedPlans) => [newSavedPlan, ...previousSavedPlans]);
  }

  /*
    Remove a saved plan by id.
  */
  function handleDeletePlan(planId) {
    setSavedPlans((previousSavedPlans) =>
      previousSavedPlans.filter((plan) => plan.id !== planId)
    );
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>PacePilot.io</h1>
        <p>Your flexible weekly running plan generator.</p>
      </header>

      <PlanForm onGeneratePlan={handleGeneratePlan} />

      {generatedPlan.length > 0 && (
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

          <button className="save-button" onClick={handleSavePlan}>
            Save Plan
          </button>
        </section>
      )}

      {savedPlans.length > 0 && (
        <section className="saved-plans-card">
          <h2>Saved Plans</h2>

          {savedPlans.map((plan) => (
            <article key={plan.id} className="saved-plan-item">
              <div className="saved-plan-header">
                <h3>
                  {plan.inputs.weeklyMileage} mi · {plan.inputs.runDays} days ·{' '}
                  {plan.inputs.goal}
                </h3>

                <button
                  className="delete-button"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  Delete
                </button>
              </div>

              <ul>
                {plan.runs.map((run, index) => (
                  <li key={`${plan.id}-${run.type}-${index}`}>
                    <strong>{run.type}:</strong> {run.miles} miles
                    <br />
                    <span>{run.notes}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;