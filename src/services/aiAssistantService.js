// AI Assistant Service Layer (Mech Bot)
// Distinguishes local rule-based & Socratic demo responses from future live LLM/RAG backend integration.
// No API keys or secrets are stored in frontend code.

import { TOPIC_CHECKPOINTS, COURSE_TO_PROJECT_MAP } from '../data/interactiveClassroomData';

export const THINKING_FLOWS = {
  gen: ['Analyzing request', 'Accessing files', 'Loading memory', 'Loading courses', 'Arranging MechTracks'],
  genp: ['Analyzing request', 'Accessing files', 'Loading memory', 'Loading projects', 'Arranging MechTracks'],
  cq: ['Analyzing request', 'Accessing files', 'Checking course content', 'Breaking down request', 'Writing your answer'],
  socratic: ['Reading current lesson', 'Checking your step', 'Formulating guiding question', 'Preparing Socratic hint'],
  quiz: ['Analyzing request', 'Accessing files', 'Loading quiz bank', 'Preparing your questions'],
  game: ['Analyzing request', 'Accessing files', 'Loading game library', 'Setting up your round'],
  lab: ['Analyzing request', 'Accessing files', 'Loading AI Lab tools', 'Preparing your experiment'],
  web: ['Analyzing request', 'Surfing', 'Breaking down request', 'Putting the answer together']
};

export const COURSE_TEMPLATES = [
  [/robot/, 'Robotics Essentials', ['What is a robot', 'Sensors and perception', 'Motors and actuators', 'Control and PID', 'Mobile robots', 'Robot arms', 'Final robot lab']],
  [/\bai\b|artificial|machine learning|neural|deep learning/, 'AI Foundations', ['1.1 What is AI, ML, and Deep Learning', '1.2 Real-World Use Cases', '1.3 Ethics and Limitations', '2.1 Python Essentials', '2.2 NumPy Basics', '3.1 Linear Algebra Essentials', '3.2 Probability and Statistics', '4.1 Supervised vs. Unsupervised Learning', '4.2 Regression', '4.3 Classification', '4.4 Predict Outcome Capstone']],
  [/mechatron/, 'Mechatronics Essentials', ['1.1 What Is Mechatronics?', '1.2 Real-World Mechatronic Systems', '1.3 The Mechatronics Design Process', '2.1 Voltage, Current, and Resistance', '2.2 Series vs. Parallel Circuits', '2.3 Essential Components', '2.4 Datasheets and Multimeters', '3.1 What Is a Sensor: Analog vs. Digital', '3.2 Common Sensor Types', '3.3 Reading Sensor Data with a Microcontroller', '4.1 What Is an Actuator?']],
  [/arduino|embedded|microcontroller|iot/, 'Embedded Systems Starter', ['Electronics recap', 'Arduino basics', 'Digital input and output', 'Analog sensors', 'Serial and displays']],
  [/python|programming|coding/, 'Python for Makers', ['Python basics', 'Variables and loops', 'Functions', 'Libraries', 'Talk to hardware', 'Mini project']]
];

export const PROJECT_TEMPLATES = [
  [/arm|gripper/, 'Robotic Arm', ['Design the arm', 'Cut or print the parts', 'Mount the servos', 'Wire the controller', 'Write the motion code', 'Test and calibrate', 'Demo day']],
  [/drone|quad/, 'Drone Build', ['Choose the parts', 'Assemble the frame', 'Motors and ESCs', 'Flight controller', 'Radio setup', 'Calibration', 'Test flight', 'Demo day']],
  [/smart|home|weather/, 'Smart Home Sensor', ['Plan the system', 'Pick the sensor', 'Connect the board', 'Send the data', 'Build the dashboard', 'Test and tune']]
];

export const INITIAL_CHAT_HISTORY = [
  { id: 'hist-1', prompt: 'How does a PID controller work?', timeLabel: 'Today' },
  { id: 'hist-2', prompt: 'Arduino or ESP32 for my first robot?', timeLabel: 'Yesterday' },
  { id: 'hist-3', prompt: "Explain Ohm's law with an example", timeLabel: '3 days ago' },
  { id: 'hist-4', prompt: 'Suggest a beginner AI project', timeLabel: 'Last week' }
];

/**
 * Generates a 3-tier Socratic coaching hint for a given lesson topic or checkpoint question
 * without immediately giving away the final answer on Tier 1 or Tier 2.
 */
export function getSocraticGuidance(topicId, checkpointIdx = 0, tier = 1) {
  const list = TOPIC_CHECKPOINTS[topicId] || TOPIC_CHECKPOINTS['robotics-pid'];
  const item = list[checkpointIdx % list.length] || list[0];

  if (tier === 1) {
    return {
      tier: 1,
      label: 'Tier 1 · Guiding Question',
      text: `🤔 Let’s think through this together without spoiling the answer: ${item.hint}`
    };
  }
  if (tier === 2) {
    return {
      tier: 2,
      label: 'Tier 2 · Concept Clue',
      text: `💡 Concept clue: Focus on "${item.q}". Eliminate the options that contradict the core principle in this section, then test your remaining choice.`
    };
  }
  return {
    tier: 3,
    label: 'Tier 3 · Step-by-Step Breakdown',
    text: `📘 Worked reasoning: ${item.explain}`
  };
}

/**
 * Generates a Mech Bot response plan matching the original script.js behavior,
 * enriched with Socratic context-awareness of the 22 extracted AI and Mechatronics course lessons.
 *
 * BACKEND INTEGRATION POINT: A backend developer can replace or augment this planner with
 * an LLM/RAG call that receives `{ promptText, activeContext }` and returns `{ f, a, list?, l? }`.
 */
export function planMechBotResponse(
  promptText,
  {
    createTrack = () => 'custom',
    selectCourse = () => {},
    selectLesson = () => {},
    activeContext: nestedContext = null
  } = {},
  externalActiveContext = null
) {
  const activeContext = externalActiveContext || nestedContext || null;
  const t = (promptText || '').trim();
  const l = t.toLowerCase();

  const ex = (kind, key, txt, f) => ({
    f,
    a: txt,
    l: ['Open MechTrack', '#' + kind, () => selectCourse(kind, key)]
  });

  const gen = (kind, title, stops, intro) => {
    let createdKey = null;
    return {
      f: kind === 'course' ? THINKING_FLOWS.gen : THINKING_FLOWS.genp,
      a: `${intro} I arranged a ${stops.length}-stop MechTrack.`,
      list: stops,
      on: () => {
        createdKey = createTrack(kind, title, stops);
      },
      l: ['Open MechTrack', '#' + kind, () => {
        if (createdKey) selectCourse(kind, createdKey);
      }]
    };
  };

  const cq = (key, txt, lessonOption = null) => ({
    f: THINKING_FLOWS.cq,
    a: txt,
    l: lessonOption
      ? [lessonOption.label, '#lesson', () => selectLesson(key, lessonOption.stepIndex)]
      : ['Open course', '#course', () => selectCourse('course', key)]
  });

  // Socratic coaching request ("hint", "stuck", "help me think", "guide me", "tier 1/2/3")
  if (/socratic|hint|stuck|don't tell me the answer|guide me|tier [123]/.test(l)) {
    const topicId = activeContext?.topicId || (activeContext?.courseKey === 'ai' ? 'ai-m1-t1.1' : 'mechatronics-m2-t2.1');
    const cKey = activeContext?.courseKey || 'mechatronics';
    const sIdx = typeof activeContext?.stepIndex === 'number' ? activeContext.stepIndex : 0;
    const requestedTier = activeContext?.socraticTier || activeContext?.hintTier || 1;
    const guidance = getSocraticGuidance(topicId, activeContext?.checkpointIdx || 0, requestedTier);
    return {
      f: THINKING_FLOWS.socratic,
      a: `${guidance.text} Try testing a value in the Interactive Concept Explorer or picking an option—ask me again if you want the next hint tier!`,
      l: ['Back to active lesson', '#lesson', () => selectLesson(cKey, sIdx)]
    };
  }

  // Context-aware "apply to project" request
  if (/apply.*project|which project|use this in a build/.test(l)) {
    const cKey = activeContext?.courseKey || 'mechatronics';
    const bridge = COURSE_TO_PROJECT_MAP[cKey] || COURSE_TO_PROJECT_MAP.mechatronics;
    return ex(
      'project',
      bridge.projectKey,
      `You can apply what you are learning directly in the ${bridge.projectTitle} build (or the ${bridge.secondaryProjectTitle}). Each station on the project MechTrack links back to the exact sensor, circuit, and control lessons.`,
      THINKING_FLOWS.genp
    );
  }

  if (/suggest.*course|recommend.*course/.test(l)) {
    return ex(
      'course',
      'mechatronics',
      'I checked your memory: you have robotics and AI started, so I suggest the 11-lesson Mechatronics course (4 modules from What Is Mechatronics to Actuators).',
      THINKING_FLOWS.gen
    );
  }

  if (/suggest.*project|project idea|new build/.test(l)) {
    return gen(
      'project',
      'Robotic Arm',
      PROJECT_TEMPLATES[0][2],
      'You have built a line follower and an obstacle robot, so a Robotic Arm is a good next build.'
    );
  }

  if (/want to (learn|study)|teach me|start learning|learn about|enrol|enroll|help me learn/.test(l)) {
    if (/drone|quad/.test(l)) {
      return ex('course', 'drone', 'You already have Custom Drone Build in progress, with 5 of 6 modules done.', THINKING_FLOWS.gen);
    }
    if (/mechatron/.test(l)) {
      return ex('course', 'mechatronics', 'The Mechatronics course is ready with 4 modules and 11 illustrated lessons.', THINKING_FLOWS.gen);
    }
    for (let i = 0; i < COURSE_TEMPLATES.length; i++) {
      if (COURSE_TEMPLATES[i][0].test(l)) {
        return gen('course', COURSE_TEMPLATES[i][1], COURSE_TEMPLATES[i][2], 'Great choice.');
      }
    }
    return {
      f: THINKING_FLOWS.gen,
      a: 'Mech Lab offers AI, robotics and mechatronics for now. Want me to build a MechTrack for one of those?'
    };
  }

  if (/want to build|build (a|an|me)|make (a|an)|create (a|an)/.test(l)) {
    if (/obstacle/.test(l)) {
      return ex('project', 'obstacle', 'You already have the Obstacle-Avoiding Robot in progress, at 40%.', THINKING_FLOWS.genp);
    }
    if (/line.?follow/.test(l)) {
      return ex('project', 'linecar', 'You already finished the Line-Following Car. Want a harder build?', THINKING_FLOWS.genp);
    }
    if (/temperature|alarm/.test(l)) {
      return ex('project', 'temp', 'The Temperature Alarm is ready to start. It has 5 steps.', THINKING_FLOWS.genp);
    }
    for (let i = 0; i < PROJECT_TEMPLATES.length; i++) {
      if (PROJECT_TEMPLATES[i][0].test(l)) {
        return gen('project', PROJECT_TEMPLATES[i][1], PROJECT_TEMPLATES[i][2], 'Nice build idea.');
      }
    }
    let nm = t.replace(/^.*?(build|make|create)( me)?( a| an)?\s*/i, '').replace(/[.?!]+$/, '').trim() || 'Custom Build';
    nm = nm.replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 40);
    const G = ['Plan and parts', 'Build the base', 'Wire the electronics', 'Write the code', 'Test and tune', 'Demo day', 'Show it off'];
    return gen('project', nm, G.slice(0, 4 + (nm.length % 4)), 'Nice build idea.');
  }

  if (/quiz|test me|exam/.test(l)) {
    return { f: THINKING_FLOWS.quiz, a: 'Your daily quiz is ready: 5 questions and +50 XP.', l: ['Start daily quiz', '#quiz'] };
  }
  if (/game|play|leaderboard/.test(l)) {
    return { f: THINKING_FLOWS.game, a: 'Try Sensor Rush to warm up. Your best score is 2,100.', l: ['Open games', '#games'] };
  }
  if (/\blab\b|experiment|train a model/.test(l)) {
    return { f: THINKING_FLOWS.lab, a: 'The AI Lab has a line sensor demo, a hand-sign model and an object detector.', l: ['Open the AI Lab', '#lab'] };
  }
  if (/drone/.test(l)) {
    return cq('drone', 'Custom Drone Build has 6 stops, from Core Electronics to Propulsion Systems. You are on Propulsion Systems, in Motor Calibration at 45%.');
  }
  if (/pid/.test(l)) {
    return cq('robotics', 'A PID controller compares where the robot is with where it should be. P reacts to the error now, I fixes built-up error, and D reduces overshoot. It is covered in Robotics Fundamentals, stop 4.');
  }
  if (/ohm|voltage|current|resistance|series|parallel/.test(l)) {
    return cq(
      'mechatronics',
      "Ohm's Law ties voltage (V), current (I), and resistance (R) together: V = I × R. Voltage is electrical pressure, current is charge flow, and resistance pushes back against flow. Covered in Mechatronics Module 2, Topic 2.1.",
      { label: 'Open Topic 2.1: Voltage, Current & Resistance', stepIndex: 3 }
    );
  }
  if (/pillar|what is mechatron/.test(l)) {
    return cq(
      'mechatronics',
      'Mechatronics is built from four pillars working together: Mechanical, Electrical, Software, and Control. Take any one away and you no longer have a complete mechatronic system.',
      { label: 'Open Topic 1.1: What Is Mechatronics?', stepIndex: 0 }
    );
  }
  if (/actuator/.test(l)) {
    return cq(
      'mechatronics',
      'An actuator converts energy (electric, pneumatic, or hydraulic) into physical action through a controller → driver → actuator chain. Covered in Mechatronics Module 4, Topic 4.1.',
      { label: 'Open Topic 4.1: What Is an Actuator?', stepIndex: 10 }
    );
  }
  if (/sensor|motor/.test(l)) {
    return cq('robotics', 'Sensors tell a robot about the world, like distance, light and motion, and motors act on it. Both are covered in Robotics Fundamentals and Mechatronics Module 3 & 4.');
  }
  if (/robot/.test(l)) {
    return cq('robotics', 'Robotics Fundamentals has 7 stops. You are at stop 4, Control and PID.');
  }
  if (/supervised|unsupervised|regression|classification|numpy|linear algebra/.test(l)) {
    return cq('ai', 'Artificial Intelligence Basics covers AI/ML/DL foundations, Python & NumPy, Linear Algebra & Probability, and Supervised vs. Unsupervised ML across 11 lessons.');
  }
  if (/\bai\b|artificial|machine learning/.test(l)) {
    return cq('ai', 'AI Basics has 11 lessons across 4 modules, from What is AI, ML, and Deep Learning to the Predict-Outcome Capstone.');
  }
  if (/arduino|micro|embedded/.test(l)) {
    return cq('micro', 'Microcontrollers 101 has 5 stops. You are on Arduino basics, where you blink an LED and read a button.');
  }
  if (/course|lesson|module|track|circuit|mechatron/.test(l)) {
    return { f: THINKING_FLOWS.cq, a: 'You have courses in progress including Custom Drone Build, Robotics Fundamentals, AI Basics (11 PDF lessons), and Mechatronics (11 PDF lessons).', l: ['Open my courses', '#courses'] };
  }
  if (/physics|newton|gravity|force|energy/.test(l)) {
    return { f: THINKING_FLOWS.web, a: 'Newton second law says force equals mass times acceleration (F = ma). A heavier object needs more force to speed up. Want me to connect this to how robot motors work?' };
  }
  return { f: THINKING_FLOWS.web, a: 'That is outside Mech Lab, but I looked it up for you. Ask me to go deeper, or I can connect it to something you are learning.' };
}

export async function executeSandboxCode(code = '') {
  const c = String(code);
  const rangeMatch = c.match(/range\((\d+)\)/);
  if (rangeMatch) {
    return { output: `Loop ran ${rangeMatch[1]} times successfully.` };
  }
  return { output: 'Sandbox code executed cleanly.' };
}

export async function explainCodeSnippet(code = '') {
  const c = String(code);
  if (c.includes('def ')) {
    return { explanation: 'This snippet defines a reusable Python function.' };
  }
  return { explanation: 'This snippet processes sensor or model data step by step.' };
}

export async function sendChatMessage(text = '', activeContext = null) {
  const plan = planMechBotResponse(text, {}, activeContext);
  return { text: plan.a, plan };
}
