import { useEffect, useState } from 'react';
import PlanForm from './components/PlanForm';
import generatePlan from './utils/generatePlan';

const MIN_SUPPORTED_MILEAGE = 8;
const MAX_SUPPORTED_MILEAGE = 45;

function App() {
  const [submittedPlanData, setSubmittedPlanData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');
  const [generationMessage, setGenerationMessage] = useState('');

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
    Generate a plan only if the user's mileage is within
    the supported recreational range for PacePilot.
  */
  function handleGeneratePlan(formData) {
    const weeklyMileage = Number(formData.weeklyMileage);

    setSubmittedPlanData(formData);
    setSaveMessage('');

    if (weeklyMileage > MAX_SUPPORTED_MILEAGE) {
      setGeneratedPlan([]);
      setGenerationMessage(
        `PacePilot is currently designed for beginner and intermediate recreational runners between ${MIN_SUPPORTED_MILEAGE} and ${MAX_SUPPORTED_MILEAGE} weekly miles. Please enter a lower mileage to generate a plan.`
      );
      return;
    }

    if (weeklyMileage < MIN_SUPPORTED_MILEAGE) {
      setGeneratedPlan([]);
      setGenerationMessage(
        `PacePilot currently works best between ${MIN_SUPPORTED_MILEAGE} and ${MAX_SUPPORTED_MILEAGE} weekly miles. Please enter at least ${MIN_SUPPORTED_MILEAGE} weekly miles to generate a plan.`
      );
      return;
    }

    setGenerationMessage('');

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

    const currentPlanSignature = JSON.stringify({
      inputs: submittedPlanData,
      runs: generatedPlan,
    });

    const isDuplicatePlan = savedPlans.some((plan) => {
      const savedPlanSignature = JSON.stringify({
        inputs: plan.inputs,
        runs: plan.runs,
      });

      return savedPlanSignature === currentPlanSignature;
    });

    if (isDuplicatePlan) {
      setSaveMessage('This plan is already saved.');
      return;
    }

    const newSavedPlan = {
      id: crypto.randomUUID(),
      inputs: submittedPlanData,
      runs: generatedPlan,
    };

    setSavedPlans((previousSavedPlans) => [newSavedPlan, ...previousSavedPlans]);
    setSaveMessage('Plan saved successfully.');
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

      {generationMessage && (
        <section className="results-card">
          <h2>Plan Guidance</h2>
          <p className="generation-message">{generationMessage}</p>
        </section>
      )}

      {generatedPlan.length > 0 && (
        <section className="results-card">
          <h2>Your Weekly Plan</h2>

          <ul>
            {generatedPlan.map((run, index) => (
              <li key={`${run.type}-${index}`}>
                <strong>{run.type}:</strong> {run.miles} miles
                {run.workoutLabel && (
                  <>
                    <br />
                    <span className="workout-label">{run.workoutLabel}</span>
                  </>
                )}
                <br />
                <span>{run.notes}</span>
              </li>
            ))}
          </ul>

          <button className="save-button" onClick={handleSavePlan}>
            Save Plan
          </button>

          {saveMessage && <p className="save-message">{saveMessage}</p>}
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
                    {run.workoutLabel && (
                      <>
                        <br />
                        <span className="workout-label">{run.workoutLabel}</span>
                      </>
                    )}
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