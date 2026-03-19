import { useEffect, useState } from 'react';
import PlanForm from './components/PlanForm';
import RunList from './components/RunList';
import SavedPlanCard from './components/SavedPlanCard';
import generatePlan from './utils/generatePlan';

const MIN_SUPPORTED_MILEAGE = 8;
const MAX_SUPPORTED_MILEAGE = 45;

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

function App() {
  const [submittedPlanData, setSubmittedPlanData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');
  const [generationMessage, setGenerationMessage] = useState('');
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState([]);

  const [savedPlans, setSavedPlans] = useState(() => {
    const storedPlans = localStorage.getItem('pacepilot-saved-plans');

    if (!storedPlans) {
      return [];
    }

    try {
      return JSON.parse(storedPlans);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('pacepilot-saved-plans', JSON.stringify(savedPlans));
  }, [savedPlans]);

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

  function toggleWorkoutExplanation(explanationId) {
    setExpandedWorkoutIds((previousExpandedIds) => {
      if (previousExpandedIds.includes(explanationId)) {
        return previousExpandedIds.filter((id) => id !== explanationId);
      }

      return [...previousExpandedIds, explanationId];
    });
  }

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

          <RunList
            runs={generatedPlan}
            expandedWorkoutIds={expandedWorkoutIds}
            onToggleExplanation={toggleWorkoutExplanation}
            idPrefix="generated"
          />

          <button type="button" className="save-button" onClick={handleSavePlan}>
            Save Plan
          </button>

          {saveMessage && <p className="save-message">{saveMessage}</p>}
        </section>
      )}

      {savedPlans.length > 0 && (
        <section className="saved-plans-card">
          <h2>Saved Plans</h2>

          {savedPlans.map((plan) => (
            <SavedPlanCard
              key={plan.id}
              plan={plan}
              expandedWorkoutIds={expandedWorkoutIds}
              onToggleExplanation={toggleWorkoutExplanation}
              onDeletePlan={handleDeletePlan}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default App;