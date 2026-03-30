import { useState } from "react";
// import { updateProfile } from "../api/profileApi";
import { profileApi } from "../api/profileApi";
import { formatProfileData } from "../utils/formatData";

const ProfileForm = () => {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    isSmoker: "",
    exerciseTypes: "",
    medicalConditions: "",
    healthGoal: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedData = formatProfileData(form);

    //   const res = await updateProfile(formattedData);
         const res = await profileApi.updateProfile(formattedData);
      console.log("Success:", res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Health Profile</h2>

      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="gender" placeholder="Gender" onChange={handleChange} />
      <input name="weight" placeholder="Weight" onChange={handleChange} />
      <input name="height" placeholder="Height" onChange={handleChange} />

      <select name="isSmoker" onChange={handleChange}>
        <option value="">Smoking?</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>

      <input
        name="exerciseTypes"
        placeholder="Exercise (comma separated)"
        onChange={handleChange}
      />

      <input
        name="medicalConditions"
        placeholder="Medical Conditions (comma separated)"
        onChange={handleChange}
      />

      <input
        name="healthGoal"
        placeholder="Health Goal"
        onChange={handleChange}
      />

      <button type="submit">Save</button>
    </form>
  );
};

export default ProfileForm;