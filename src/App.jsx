import React from 'react';
import { MechLabProvider, useMechLab } from './context/MechLabContext';
import BottomNav from './components/layout/BottomNav';
import GlobalOverlays from './components/layout/GlobalOverlays';

import AuthScreen from './screens/AuthScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import CoursesScreen from './screens/CoursesScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import CourseTrackScreen from './screens/CourseTrackScreen';
import ProjectTrackScreen from './screens/ProjectTrackScreen';
import LessonScreen from './screens/LessonScreen';
import AiLabScreen from './screens/AiLabScreen';
import QuizzesScreen from './screens/QuizzesScreen';
import GamesScreen from './screens/GamesScreen';
import CommunityScreen from './screens/CommunityScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AppearanceScreen from './screens/AppearanceScreen';
import SettingsScreen from './screens/SettingsScreen';
import MessagesScreen from './screens/MessagesScreen';
import ActivityScreen from './screens/ActivityScreen';
import AskScreen from './screens/AskScreen';
import ExperimentScreen from './screens/ExperimentScreen';
import GameScreen from './screens/GameScreen';
import QuizScreen from './screens/QuizScreen';
import ThreadScreen from './screens/ThreadScreen';
import LanguageScreen from './screens/LanguageScreen';
import HelpScreen from './screens/HelpScreen';
import TermsScreen from './screens/TermsScreen';

function MechLabClassroomApp() {
  const { currentScreen } = useMechLab();

  return (
    <>
      <BottomNav />
      <AuthScreen active={currentScreen === 'auth'} />
      <SignupScreen active={currentScreen === 'signup'} />
      <DashboardScreen active={currentScreen === 'dash'} />
      <CoursesScreen active={currentScreen === 'courses'} />
      <ProjectsScreen active={currentScreen === 'projects'} />
      <CourseTrackScreen active={currentScreen === 'course'} />
      <ProjectTrackScreen active={currentScreen === 'project'} />
      <LessonScreen active={currentScreen === 'lesson'} />
      <AiLabScreen active={currentScreen === 'lab'} />
      <QuizzesScreen active={currentScreen === 'quizzes'} />
      <GamesScreen active={currentScreen === 'games'} />
      <CommunityScreen active={currentScreen === 'community'} />
      <ProfileScreen active={currentScreen === 'profile'} />
      <ChatScreen active={currentScreen === 'chat'} />
      <NotificationsScreen active={currentScreen === 'notifications'} />
      <AppearanceScreen active={currentScreen === 'appearance'} />
      <SettingsScreen active={currentScreen === 'settings'} />
      <MessagesScreen active={currentScreen === 'messages'} />
      <ActivityScreen active={currentScreen === 'activity'} />
      <AskScreen active={currentScreen === 'ask'} />
      <ExperimentScreen active={currentScreen === 'experiment'} />
      <GameScreen active={currentScreen === 'game'} />
      <QuizScreen active={currentScreen === 'quiz'} />
      <ThreadScreen active={currentScreen === 'thread'} />
      <LanguageScreen active={currentScreen === 'language'} />
      <HelpScreen active={currentScreen === 'help'} />
      <TermsScreen active={currentScreen === 'terms'} />
      <GlobalOverlays />
    </>
  );
}

export default function App() {
  return (
    <MechLabProvider>
      <MechLabClassroomApp />
    </MechLabProvider>
  );
}
