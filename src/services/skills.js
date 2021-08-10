/**
 * Topcoder TaaS Service
 */
import { axiosInstance as axios } from "./requestInterceptor";
import config from "../../config";

const skillPageSize = 100;
let cachedSkillsAsPromise;

/**
 * Loads and caches all the skills the first time. Returns the skills list from the cache from the second time.
 */
export function getSkills() {
  cachedSkillsAsPromise =
    cachedSkillsAsPromise ||
    getAllSkills().catch((ex) => {
      console.error("Error loading skills", ex);
      cachedSkillsAsPromise = null;
      return { data: [] };
    });
  return cachedSkillsAsPromise;
}

/**
 * Recursively loads all the pages from skills api.
 */
function getAllSkills() {
  let skills = [];

  return new Promise((resolve, reject) => {
    const loop = (page) =>
      getSkillsPage(page)
        .then((skillResponse) => {
          skills = skills.concat(skillResponse.data);
          if (skillResponse.data.length === skillPageSize) {
            page++;
            loop(page);
          } else {
            skills.sort((a, b) => {
              if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
              if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
              return 0;
            });
            resolve({
              data: skills,
            });
          }
        })
        .catch((ex) => reject(ex));

    loop(1);
  }).then((skills) => {
    console.log("skills: ", JSON.stringify(skills)); // eslint-disable-line no-console
    return skills;
  });
}

/**
 * Loads the skills in the given page.
 * @param {number} page The page number to load
 */
function getSkillsPage(page) {
  return axios.get(
    `${config.API.V5}/taas-teams/skills?perPage=${skillPageSize}&orderBy=name&page=${page}`
  );
}
