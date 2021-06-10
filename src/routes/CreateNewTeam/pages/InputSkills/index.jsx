/**
 * Input Skills page
 * Page that user reaches after choosing to input job skills.
 *
 * Gets a project id from the router.
 *
 * Allows selecting a number of skills, searching for users
 * with those skills, and submitting a job requiring the skills.
 */
import React, { useCallback, useState } from "react";
import { useData } from "hooks/useData";
import SkillsList from "./components/SkillsList";
import { getSkills } from "services/skills";
import LoadingIndicator from "components/LoadingIndicator";
import SearchContainer from "../../components/SearchContainer";

function InputSkills({ location: { state: locationState } }) {
  const [stages, setStages] = useState([
    { name: "Input Skills", isCurrent: true },
    { name: "Search Member" },
    { name: "Overview of the Results" },
  ]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [skills, loadingError] = useData(getSkills);

  const toggleSkill = useCallback(
    (id) => {
      if (selectedSkills.includes(id)) {
        setSelectedSkills(selectedSkills.filter((skill) => skill !== id));
      } else {
        setSelectedSkills(() => {
          return [...selectedSkills, id];
        });
      }
    },
    [selectedSkills]
  );

  if (!skills) {
    return <LoadingIndicator error={loadingError} />;
  }

  return (
    <SearchContainer
      stages={stages}
      setStages={setStages}
      isCompletenessDisabled={selectedSkills.length < 1}
      searchObject={{ skills: selectedSkills }}
      completenessStyle="input-skills"
      locationState={locationState}
    >
      <SkillsList
        skills={skills}
        selectedSkills={selectedSkills}
        toggleSkill={toggleSkill}
      />
    </SearchContainer>
  );
}

export default InputSkills;
