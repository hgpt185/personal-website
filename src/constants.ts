import personal from '../info/personal.json';
import experience from '../info/experience.json';
import projects from '../info/projects.json';
import skills from '../info/skills.json';
import about from '../info/about.json';
import { allPosts } from './lib/posts';

export const PORTFOLIO_DATA = {
  ...personal,
  experience,
  projects,
  skills,
  about,
  blog: allPosts,
};
