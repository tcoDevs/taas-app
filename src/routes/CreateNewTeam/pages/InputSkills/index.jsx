/**
 * Input Skills page
 * Page that user reaches after choosing to input job skills.
 *
 * Allows selecting a number of skills, searching for users
 * with those skills, and submitting a job requiring the skills.
 */
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useData } from "hooks/useData";
import { setIsLoading } from "../../actions";
import SkillsList from "./components/SkillsList";
import { getSkills } from "services/skills";
import LoadingIndicator from "components/LoadingIndicator";
import SkillListPopup from "../../components/SkillListPopup";
import SearchAndSubmit from "../../components/SearchAndSubmit";

function InputSkills() {
  const dispatch = useDispatch();
  const [stages, setStages] = useState([
    { name: "Input Skills", isCurrent: true },
    { name: "Search Member" },
    { name: "Overview of the Results" },
    { name: "Refundable Deposite Payment" },
  ]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [popupSelectedSkills, setPopupSelectedSkills] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [skills, loadingError] = useData(getSkills);

  const toggleSkill = useCallback(
    (skill) => {
      const isSelected =
        selectedSkills.findIndex((s) => s.id === skill.id) > -1;
      if (isSelected) {
        setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
      } else {
        setSelectedSkills(() => {
          return [...selectedSkills, skill];
        });
      }
    },
    [selectedSkills]
  );

  const onClick = useCallback(() => {
    setPopupSelectedSkills([]);
    setPopupOpen(true);
  }, []);

  const onContinueClick = useCallback((searchFunc) => {
    setIsPopupLoading(true);
    setTimeout(searchFunc, 100);
  }, []);

  if (!Array.isArray(skills)) {
    dispatch(setIsLoading(true));
    return <LoadingIndicator error={loadingError} />;
  } else if (skills.length === 0) {
    return <p style={{ textAlign: "center" }}>Failed to load skills</p>;
  } else {
    dispatch(setIsLoading(false));
  }

  return (
    <SearchAndSubmit
      stages={stages}
      setStages={setStages}
      isProgressDisabled={selectedSkills.length < 1}
      searchObject={{ skills: popupSelectedSkills }}
      page="skills"
      progressStyle="input-skills"
      onClick={onClick}
      toRender={(searchFunc) => (
        <>
          <SkillsList
            skills={skills}
            selectedSkills={selectedSkills}
            toggleSkill={toggleSkill}
          />
          <SkillListPopup
            page="skills"
            open={popupOpen}
            onClose={() => setPopupOpen(false)}
            skills={selectedSkills}
            selectedSkills={popupSelectedSkills}
            setSelectedSkills={setPopupSelectedSkills}
            isLoading={isPopupLoading}
            onContinueClick={() => onContinueClick(searchFunc)}
          />
        </>
      )}
    />
  );
}

export default InputSkills;
