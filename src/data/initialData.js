// Original data structures preserved from ai-mech-lab/script.js

export const SCREEN_ROUTES = [
  'auth', 'signup', 'dash', 'courses', 'projects', 'course', 'project', 'lesson',
  'lab', 'quizzes', 'games', 'community', 'profile', 'chat', 'notifications',
  'appearance', 'settings', 'messages', 'activity', 'ask', 'experiment', 'game',
  'quiz', 'thread', 'language', 'help', 'terms'
];

export const SCREEN_NAMES = [
  'Log in', 'Sign up', 'Dashboard', 'Learn: Courses', 'Learn: Projects',
  'MechTrack: course', 'MechTrack: project', 'Lesson', 'Practice: AI Lab',
  'Practice: Quizzes', 'Practice: Games', 'Community', 'Profile', 'Mech Bot chat',
  'Notifications', 'Appearance', 'Settings', 'Messages', 'Activity',
  'Ask a question', 'AI experiment', 'Game round', 'Quiz', 'Conversation',
  'Language', 'Help and support', 'Terms and privacy'
];

export const PARENT_NAV_MAP = {
  course: 'courses',
  project: 'courses',
  projects: 'courses',
  lesson: 'courses',
  quizzes: 'lab',
  games: 'lab',
  experiment: 'lab',
  game: 'lab',
  quiz: 'lab',
  chat: 'dash',
  notifications: 'dash',
  messages: 'dash',
  thread: 'dash',
  activity: 'dash',
  settings: 'dash',
  appearance: 'profile',
  language: 'profile',
  help: 'profile',
  terms: 'profile',
  ask: 'community',
  signup: 'auth'
};

export const FOLDER_TO_SCREEN_MAP = {
  auth: 'auth',
  login: 'auth',
  signup: 'signup',
  dash: 'dash',
  dashboard: 'dash',
  courses: 'courses',
  projects: 'projects',
  course: 'course',
  'course-details': 'course',
  project: 'project',
  'project-details': 'project',
  lesson: 'lesson',
  lab: 'lab',
  'ai-lab': 'lab',
  practice: 'lab',
  quizzes: 'quizzes',
  games: 'games',
  community: 'community',
  profile: 'profile',
  chat: 'chat',
  notifications: 'notifications',
  appearance: 'appearance',
  settings: 'settings',
  messages: 'messages',
  activity: 'activity',
  ask: 'ask',
  experiment: 'experiment',
  game: 'game',
  quiz: 'quiz',
  thread: 'thread',
  language: 'language',
  help: 'help',
  terms: 'terms'
};

export const INITIAL_TRACKS = {
  drone: {
    k: 'course',
    t: 'Custom Drone Build',
    s: [
      'Core Electronics',
      'System Architecture',
      'Propeller Aerodynamics',
      'Flight Controllers',
      'Battery Technology',
      'Propulsion Systems'
    ],
    a: 5,
    m: ['Motor Calibration', 45],
    f: ['Final assembly', 'Build complete']
  },
  robotics: {
    k: 'course',
    t: 'Robotics Fundamentals',
    s: [
      'What is a robot',
      'Sensors and perception',
      'Motors and actuators',
      'Control and PID',
      'Mobile robots',
      'Robot arms',
      'Final robot lab'
    ],
    a: 3,
    m: ['PID control basics', 30],
    f: ['Final lab', 'Course complete']
  },
  ai: {
    k: 'course',
    t: 'Artificial Intelligence Basics',
    courseSlug: 'ai',
    s: [
      '1.1 What is AI, ML, and Deep Learning',
      '1.2 Real-World Use Cases',
      '1.3 Ethics and Limitations',
      '2.1 Python Essentials',
      '2.2 NumPy Basics',
      '3.1 Linear Algebra Essentials',
      '3.2 Probability and Statistics',
      '4.1 Supervised vs. Unsupervised Learning',
      '4.2 Regression',
      '4.3 Classification',
      '4.4 Predict Outcome Capstone'
    ],
    topicSlugs: [
      'm1-t1.1', 'm1-t1.2', 'm1-t1.3',
      'm2-t2.1', 'm2-t2.2',
      'm3-t3.1', 'm3-t3.2',
      'm4-t4.1', 'm4-t4.2', 'm4-t4.3', 'm4-t4.4'
    ],
    a: 3,
    m: ['2.1 Python Essentials', 40],
    f: ['Final app', 'Course complete']
  },
  mechatronics: {
    k: 'course',
    t: 'Mechatronics',
    courseSlug: 'mechatronics',
    s: [
      '1.1 What Is Mechatronics?',
      '1.2 Real-World Mechatronic Systems',
      '1.3 The Mechatronics Design Process',
      '2.1 Voltage, Current, and Resistance',
      '2.2 Series vs. Parallel Circuits',
      '2.3 Essential Components',
      '2.4 Datasheets and Multimeters',
      '3.1 What Is a Sensor: Analog vs. Digital',
      '3.2 Common Sensor Types',
      '3.3 Reading Sensor Data with a Microcontroller',
      '4.1 What Is an Actuator?'
    ],
    topicSlugs: [
      'm1-t1.1', 'm1-t1.2', 'm1-t1.3',
      'm2-t2.1', 'm2-t2.2', 'm2-t2.3', 'm2-t2.4',
      'm3-t3.1', 'm3-t3.2', 'm3-t3.3',
      'm4-t4.1'
    ],
    a: 0,
    m: ['1.1 What Is Mechatronics?', 0],
    f: ['Final system', 'Course complete']
  },
  micro: {
    k: 'course',
    t: 'Microcontrollers 101',
    courseSlug: 'mechatronics',
    s: [
      'Electronics recap',
      'Arduino basics',
      'Digital input and output',
      'Analog sensors',
      'Serial and displays'
    ],
    topicSlugs: ['m2-t2.1', 'm3-t3.3', 'm3-t3.1', 'm3-t3.2', 'm3-t3.3'],
    a: 1,
    m: ['Blink and beyond', 60],
    f: ['Final build', 'Course complete']
  },
  elec: {
    k: 'course',
    t: 'Electronics Basics',
    courseSlug: 'mechatronics',
    s: [
      'Voltage and current',
      'Series vs. Parallel Circuits',
      'Essential Components',
      'Datasheets and Multimeters'
    ],
    topicSlugs: ['m2-t2.1', 'm2-t2.2', 'm2-t2.3', 'm2-t2.4'],
    a: 4,
    m: ['Datasheets and Multimeters', 100],
    f: ['Final circuit', 'Course complete']
  },
  sensors: {
    k: 'course',
    t: 'Sensors and Actuators',
    courseSlug: 'mechatronics',
    s: [
      'What is a sensor: Analog vs. Digital',
      'Common sensor types',
      'Reading sensor data with a microcontroller',
      'What is an actuator?'
    ],
    topicSlugs: ['m3-t3.1', 'm3-t3.2', 'm3-t3.3', 'm4-t4.1'],
    a: 0,
    m: ['What is a sensor: Analog vs. Digital', 0],
    f: ['Final project', 'Course complete']
  },
  obstacle: {
    k: 'project',
    t: 'Obstacle-Avoiding Robot',
    s: [
      'Plan and parts',
      'Wire the sensor',
      'Code the motors',
      'Obstacle logic',
      'Test and tune',
      'Demo day'
    ],
    a: 2,
    m: ['Motor logic', 40],
    f: ['Final demo', 'Project complete']
  },
  linecar: {
    k: 'project',
    t: 'Line-Following Car',
    s: [
      'Build the chassis',
      'Wire the IR sensors',
      'Code the line logic',
      'Race test'
    ],
    a: 4,
    f: ['Final demo', 'Project complete']
  },
  temp: {
    k: 'project',
    t: 'Temperature Alarm',
    s: [
      'Pick the parts',
      'Connect the sensor',
      'Read the temperature',
      'Add the buzzer alarm',
      'Enclosure and test'
    ],
    a: 0,
    m: ['Step 1', 0],
    f: ['Final demo', 'Project complete']
  }
};

export const QUIZ_QUESTIONS = [
  ['Which sensor measures distance using sound?', ['IR line sensor', 'Ultrasonic sensor', 'Light sensor'], 1],
  ['What does the D in PID reduce?', ['Overshoot', 'Battery use', 'Weight'], 0],
  ['Which part makes a robot move?', ['Actuator', 'Resistor', 'Sensor'], 0],
  ['What does an Arduino run?', ['A program', 'A website', 'A game only'], 0],
  ['Which unit measures current?', ['Volt', 'Ampere', 'Ohm'], 1]
];

export const COUNTRIES = "Afghanistan,Albania,Algeria,Andorra,Angola,Antigua and Barbuda,Argentina,Armenia,Australia,Austria,Azerbaijan,Bahamas,Bahrain,Bangladesh,Barbados,Belarus,Belgium,Belize,Benin,Bhutan,Bolivia,Bosnia and Herzegovina,Botswana,Brazil,Brunei,Bulgaria,Burkina Faso,Burundi,Cabo Verde,Cambodia,Cameroon,Canada,Central African Republic,Chad,Chile,China,Colombia,Comoros,Congo (Republic),Congo (DR),Costa Rica,Côte d'Ivoire,Croatia,Cuba,Cyprus,Czechia,Denmark,Djibouti,Dominica,Dominican Republic,Ecuador,Egypt,El Salvador,Equatorial Guinea,Eritrea,Estonia,Eswatini,Ethiopia,Fiji,Finland,France,Gabon,Gambia,Georgia,Germany,Ghana,Greece,Grenada,Guatemala,Guinea,Guinea-Bissau,Guyana,Haiti,Honduras,Hungary,Iceland,India,Indonesia,Iran,Iraq,Ireland,Israel,Italy,Jamaica,Japan,Jordan,Kazakhstan,Kenya,Kiribati,Kosovo,Kuwait,Kyrgyzstan,Laos,Latvia,Lebanon,Lesotho,Liberia,Libya,Liechtenstein,Lithuania,Luxembourg,Madagascar,Malawi,Malaysia,Maldives,Mali,Malta,Marshall Islands,Mauritania,Mauritius,Mexico,Micronesia,Moldova,Monaco,Mongolia,Montenegro,Morocco,Mozambique,Myanmar,Namibia,Nauru,Nepal,Netherlands,New Zealand,Nicaragua,Niger,Nigeria,North Korea,North Macedonia,Norway,Oman,Pakistan,Palau,Palestine,Panama,Papua New Guinea,Paraguay,Peru,Philippines,Poland,Portugal,Qatar,Romania,Russia,Rwanda,Saint Kitts and Nevis,Saint Lucia,Saint Vincent and the Grenadines,Samoa,San Marino,São Tomé and Príncipe,Saudi Arabia,Senegal,Serbia,Seychelles,Sierra Leone,Singapore,Slovakia,Slovenia,Solomon Islands,Somalia,South Africa,South Korea,South Sudan,Spain,Sri Lanka,Sudan,Suriname,Sweden,Switzerland,Syria,Taiwan,Tajikistan,Tanzania,Thailand,Timor-Leste,Togo,Tonga,Trinidad and Tobago,Tunisia,Türkiye,Turkmenistan,Tuvalu,Uganda,Ukraine,United Arab Emirates,United Kingdom,United States,Uruguay,Uzbekistan,Vanuatu,Vatican City,Venezuela,Vietnam,Yemen,Zambia,Zimbabwe".split(',');

export const CITIES_BY_COUNTRY = {
  'Nigeria': ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Kaduna', 'Enugu', 'Owerri', 'Benin City', 'Aba', 'Abeokuta', 'Jos', 'Calabar', 'Uyo', 'Warri', 'Onitsha', 'Awka', 'Umuahia', 'Akure', 'Ilorin'],
  'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast'],
  'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
  'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Gqeberha'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco', 'Seattle', 'Boston', 'Austin'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Edinburgh', 'Leeds'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'India': ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune'],
  'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya', 'Yokohama'],
  'China': ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Chengdu'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
  'Ireland': ['Dublin', 'Cork', 'Galway'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'Utrecht']
};
