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
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState([]);

  /*
    Takes weekly mileage and returns run day counts that PacePilot
    supports.
  */
  function getSupportedRunDaysForMileage(weeklyMileage) {
  if (weeklyMileage <= 15) {
    return [3, 4];
  }

  if (weeklyMileage <= 25) {
    return [3, 4, 5];
  }

  if (weeklyMileage <= 35) {
    return [4, 5, 6];
  }

  return [5, 6];
}

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
    const runDays = Number(formData.runDays);
    const supportedRunDays = getSupportedRunDaysForMileage(weeklyMileage);

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

    if (!supportedRunDays.includes(runDays)) {
      setGeneratedPlan([]);
      setGenerationMessage(
        `For ${weeklyMileage} weekly miles, PacePilot currently supports ${supportedRunDays.join(' or ')} run days per week. Please adjust your run days to generate a plan.`
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
    If workout explanation is open, closes it once clicked.
    If closed, clicking will open.
  */
  function toggleWorkoutExplanation(explanationId) {
    setExpandedWorkoutIds((previousExpandedIds) => {
      if (previousExpandedIds.includes(explanationId)) {
        return previousExpandedIds.filter((id) => id !== explanationId);
      }

      return [...previousExpandedIds, explanationId];
    });
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
        <div className="hero-badge-row">
          <span className="hero-badge">Beginner to intermediate</span>
          <span className="hero-badge">8 to 45 weekly miles</span>
          <span className="hero-badge">Recreational runners</span>
        </div>

        <h1>PacePilot.io</h1>

        <p className="hero-subtitle">
          Flexible weekly running plans for beginner and intermediate recreational runners.
        </p>

        <p className="hero-description">
          Build consistency, improve endurance, and add simple speed work without overcomplicating your week.
        </p>
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

                {run.workoutExplanation && (
                  <>
                    <br />
                    <button
                      type="button"
                      className="toggle-explanation-button"
                      onClick={() => toggleWorkoutExplanation(`generated-${index}`)}
                    >
                      {expandedWorkoutIds.includes(`generated-${index}`)
                        ? 'Hide workout explanation'
                        : 'How this workout works'}
                    </button>

                    {expandedWorkoutIds.includes(`generated-${index}`) && (
                      <p className="workout-explanation">
                        {run.workoutExplanation}
                      </p>
                    )}
                  </>
                )}
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

                    {run.workoutExplanation && (
                      <>
                        <br />
                        <button
                          type="button"
                          className="toggle-explanation-button"
                          onClick={() =>
                            toggleWorkoutExplanation(`${plan.id}-${index}`)
                          }
                        >
                          {expandedWorkoutIds.includes(`${plan.id}-${index}`)
                            ? 'Hide workout explanation'
                            : 'How this workout works'}
                        </button>

                        {expandedWorkoutIds.includes(`${plan.id}-${index}`) && (
                          <p className="workout-explanation">
                            {run.workoutExplanation}
                          </p>
                        )}
                      </>
                    )}
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