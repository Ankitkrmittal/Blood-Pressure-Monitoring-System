import { useEffect, useState } from "react";
import { profileApi } from "../api/profileApi";
import { formatProfileData } from "../utils/formatData";

const initialForm = {
  age: "",
  gender: "",
  weight: "",
  height: "",
  isSmoker: "",
  alcoholUse: "",
  exerciseFrequency: "",
  exerciseTypes: "",
  sleepHours: "",
  waterIntake: "",
  dietType: "",
  junkFoodLevel: "",
  stressLevel: "",
  sleepQuality: "",
  medicalConditions: "",
  familyHistory: "",
  healthGoal: "",
};

const mapProfileToForm = (profile) => ({
  age: profile?.age?.toString() || "",
  gender: profile?.gender || "",
  weight: profile?.weight?.toString() || "",
  height: profile?.height?.toString() || "",
  isSmoker: typeof profile?.isSmoker === "boolean" ? String(profile.isSmoker) : "",
  alcoholUse: profile?.alcoholUse || "",
  exerciseFrequency: profile?.exerciseFrequency?.toString() || "",
  exerciseTypes: Array.isArray(profile?.exerciseTypes) ? profile.exerciseTypes.join(", ") : "",
  sleepHours: profile?.sleepHours?.toString() || "",
  waterIntake: profile?.waterIntake?.toString() || "",
  dietType: profile?.dietType || "",
  junkFoodLevel: profile?.junkFoodLevel || "",
  stressLevel: profile?.stressLevel?.toString() || "",
  sleepQuality: profile?.sleepQuality || "",
  medicalConditions: Array.isArray(profile?.medicalConditions)
    ? profile.medicalConditions.join(", ")
    : "",
  familyHistory: Array.isArray(profile?.familyHistory) ? profile.familyHistory.join(", ") : "",
  healthGoal: profile?.healthGoal || "",
});

const ProfileForm = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileApi.getProfile();

        if (!profile) {
          return;
        }

        setForm(mapProfileToForm(profile));
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedData = formatProfileData(form);
      const savedProfile = await profileApi.updateProfile(formattedData);
      setForm(mapProfileToForm(savedProfile));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Health Profile</h2>

      <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input name="weight" placeholder="Weight in kg" value={form.weight} onChange={handleChange} />
      <input name="height" placeholder="Height in cm" value={form.height} onChange={handleChange} />

      <select name="isSmoker" value={form.isSmoker} onChange={handleChange}>
        <option value="">Smoking status</option>
        <option value="true">Smoker</option>
        <option value="false">Non-smoker</option>
      </select>

      <select name="alcoholUse" value={form.alcoholUse} onChange={handleChange}>
        <option value="">Alcohol use</option>
        <option value="none">None</option>
        <option value="occasionally">Occasionally</option>
        <option value="frequent">Frequent</option>
      </select>

      <input
        name="exerciseFrequency"
        placeholder="Exercise days per week"
        value={form.exerciseFrequency}
        onChange={handleChange}
      />
      <input
        name="exerciseTypes"
        placeholder="Exercise types (comma separated)"
        value={form.exerciseTypes}
        onChange={handleChange}
      />
      <input
        name="sleepHours"
        placeholder="Sleep hours per night"
        value={form.sleepHours}
        onChange={handleChange}
      />
      <input
        name="waterIntake"
        placeholder="Water intake in liters/day"
        value={form.waterIntake}
        onChange={handleChange}
      />

      <select name="dietType" value={form.dietType} onChange={handleChange}>
        <option value="">Diet type</option>
        <option value="veg">Vegetarian</option>
        <option value="non-veg">Non-vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="eggetarian">Eggetarian</option>
      </select>

      <select name="junkFoodLevel" value={form.junkFoodLevel} onChange={handleChange}>
        <option value="">Junk food level</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        name="stressLevel"
        placeholder="Stress level from 1 to 10"
        value={form.stressLevel}
        onChange={handleChange}
      />

      <select name="sleepQuality" value={form.sleepQuality} onChange={handleChange}>
        <option value="">Sleep quality</option>
        <option value="good">Good</option>
        <option value="average">Average</option>
        <option value="poor">Poor</option>
      </select>

      <input
        name="medicalConditions"
        placeholder="Medical conditions (comma separated)"
        value={form.medicalConditions}
        onChange={handleChange}
      />

      <input
        name="familyHistory"
        placeholder="Family history (comma separated)"
        value={form.familyHistory}
        onChange={handleChange}
      />

      <input
        name="healthGoal"
        placeholder="Health goal such as bp_control or weight_loss"
        value={form.healthGoal}
        onChange={handleChange}
      />

      <button type="submit">Save</button>
    </form>
  );
};

export default ProfileForm;
