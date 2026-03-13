import { useState } from 'react';

/*
  PlanForm is responsible for collecting user input.
  It stores form values in local component state
  and sends the completed form data back to App
  when the user submits the form.
*/
function PlanForm({ onGeneratePlan }) {
  const [formData, setFormData] = useState({
    weeklyMileage: '',
    runDays: '4',
    experienceLevel: 'beginner',
    goal: 'stay-consistent',
    longRunPreference: 'moderate',
  });

  /*
    This function runs whenever the user changes
    an input, dropdown, or other form field.

    It updates only the field that changed while
    keeping the rest of the form data the same.
  */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  }

  /*
    This function runs when the user submits the form.
    event.preventDefault() stops the browser from
    refreshing the page, which is the default form behavior.
  */
  function handleSubmit(event) {
    event.preventDefault();
    onGeneratePlan(formData);
  }

  return (
    <section className="form-card">
      <h2>Build Your Weekly Plan</h2>

      <form onSubmit={handleSubmit} className="plan-form">
        <label htmlFor="weeklyMileage">Current weekly mileage</label>
        <input
          id="weeklyMileage"
          name="weeklyMileage"
          type="number"
          min="0"
          placeholder="Example: 20"
          value={formData.weeklyMileage}
          onChange={handleChange}
          required
        />

        <label htmlFor="runDays">Preferred run days per week</label>
        <select
          id="runDays"
          name="runDays"
          value={formData.runDays}
          onChange={handleChange}
        >
          <option value="3">3 days</option>
          <option value="4">4 days</option>
          <option value="5">5 days</option>
          <option value="6">6 days</option>
        </select>

        <label htmlFor="experienceLevel">Experience level</label>
        <select
          id="experienceLevel"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
        </select>

        <label htmlFor="goal">Training goal</label>
        <select
          id="goal"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
        >
          <option value="stay-consistent">Stay consistent</option>
          <option value="build-endurance">Build endurance</option>
          <option value="get-faster">Get faster</option>
        </select>

        <label htmlFor="longRunPreference">Long run preference</label>
        <select
          id="longRunPreference"
          name="longRunPreference"
          value={formData.longRunPreference}
          onChange={handleChange}
        >
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="strong">Strong</option>
        </select>

        <button type="submit">Generate Plan</button>
      </form>
    </section>
  );
}

export default PlanForm;