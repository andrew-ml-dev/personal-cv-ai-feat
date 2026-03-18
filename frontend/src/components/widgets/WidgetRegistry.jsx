import TextBubble from './TextBubble'
import StackWidget from './StackWidget'
import ExperienceLogWidget from './ExperienceLogWidget'
import ProjectVisionWidget from './ProjectVisionWidget'
import ContactWidget from './ContactWidget'
import EducationWidget from './EducationWidget'
import ArchitectureFlowWidget from './ArchitectureFlowWidget'
import PublicationsWidget from './PublicationsWidget'
import ResumeWidget from './ResumeWidget'

const REGISTRY = {
  TextBubble,
  StackWidget,
  ExperienceLogWidget,
  ProjectVisionWidget,
  ContactWidget,
  EducationWidget,
  ArchitectureFlowWidget,
  PublicationsWidget,
  ResumeWidget,
}

export function getWidget(type) {
  return REGISTRY[type] ?? TextBubble
}
