// Structured interactive classroom metadata grounded strictly in the 22 AI & Mechatronics course PDFs
// and the original AI Mech Lab tracks. Does not alter or replace coursesData.json.

import { QUIZ_QUESTIONS } from './initialData';

export const TOPIC_CHECKPOINTS = {
  // === ARTIFICIAL INTELLIGENCE BASICS (11 PDF TOPICS) ===
  'ai-m1-t1.1': [
    {
      q: 'How do Artificial Intelligence (AI), Machine Learning (ML), and Deep Learning (DL) relate to one another?',
      o: [
        'ML is a subset of AI, and Deep Learning is a subset of ML built on multi-layer neural networks',
        'AI is a small subset of Deep Learning used only for robotics',
        'They are three unrelated programming languages'
      ],
      a: 0,
      hint: 'Think of three concentric circles: which field is the broadest umbrella, and which is the most specialized?',
      explain: 'AI is the broadest field of creating intelligent systems. Machine Learning (ML) is a subset of AI that learns patterns from data, and Deep Learning (DL) is a specialized subset of ML using multi-layered neural networks.'
    },
    {
      q: 'What is the key difference between traditional rule-based programming and Machine Learning?',
      o: [
        'Traditional programming uses data + answers to learn rules; ML uses only hand-coded if/else rules',
        'Traditional programming takes rules + data to produce answers; ML takes data + examples/answers to learn the rules',
        'Machine Learning does not use data or math'
      ],
      a: 1,
      hint: 'In which approach does the engineer write explicit if/else rules vs. letting the algorithm infer patterns from training examples?',
      explain: 'In classical programming, humans write explicit rules to process data. In Machine Learning, we feed training data and outcomes so the model learns the underlying mapping or rules automatically.'
    }
  ],
  'ai-m1-t1.2': [
    {
      q: 'Which AI domain powers autonomous drone obstacle detection and medical X-ray image analysis?',
      o: [
        'Computer Vision (CV)',
        'Spreadsheet macros',
        'Static HTML styling'
      ],
      a: 0,
      hint: 'Which branch of AI enables machines to interpret pixels, camera feeds, and visual scenes?',
      explain: 'Computer Vision (CV) enables machines to extract meaningful features and decisions from images and video streams, such as identifying obstacles on a robot camera or anomalies in medical scans.'
    },
    {
      q: 'In predictive maintenance for industrial mechatronics, how is Machine Learning used?',
      o: [
        'It waits until a motor catches fire before logging an error',
        'It analyzes vibration, temperature, and current sensor trends to predict component failure before breakdown',
        'It replaces physical motors with text files'
      ],
      a: 1,
      hint: 'Look at the word "predictive"—what signals from a machine change before a bearing or motor fails?',
      explain: 'Predictive maintenance models monitor time-series sensor data (vibration, temperature, current draw) to detect early anomaly patterns and schedule maintenance before costly downtime occurs.'
    }
  ],
  'ai-m1-t1.3': [
    {
      q: 'What causes algorithmic bias in a trained Machine Learning model?',
      o: [
        'Using a fast GPU during training',
        'Skewed, unrepresentative, or historically biased training data',
        'Writing comments in Python code'
      ],
      a: 1,
      hint: 'Remember the principle: a model learns patterns from the dataset it is given. What happens if that dataset leaves out key groups or conditions?',
      explain: 'ML models reflect the statistical patterns of their training data. If the dataset is unrepresentative or contains historical biases, the resulting predictions will systematically underperform or discriminate.'
    },
    {
      q: 'Why is "human-in-the-loop" oversight critical when deploying AI in safety-critical robotics or healthcare?',
      o: [
        'Because AI models are probabilistic and can make high-confidence errors on out-of-distribution inputs',
        'Because Python cannot run without a keyboard press every second',
        'To slow down the computer fan'
      ],
      a: 0,
      hint: 'Can a statistical model guarantee 100% accuracy in an unseen edge case?',
      explain: 'AI models make probabilistic predictions and lack true common-sense understanding. Human oversight and hardware safety interlocks ensure safe fallback behavior when edge cases occur.'
    }
  ],
  'ai-m2-t2.1': [
    {
      q: 'In Python, which data structure stores key-value pairs (such as {"sensor": "ultrasonic", "pin": 9})?',
      o: [
        'A list ([])',
        'A dictionary ({})',
        'An integer (int)'
      ],
      a: 1,
      hint: 'Look at the curly braces and the key: value syntax used to map labels to values.',
      explain: 'Python dictionaries (dict) store mappings of unique keys to values using curly braces {}, making them ideal for configuration parameters, JSON payloads, and structured sensor readings.'
    },
    {
      q: 'What is the purpose of defining a function with `def` in Python for AI workflows?',
      o: [
        'To encapsulate reusable logic (such as data preprocessing or sensor filtering) that can be called with different inputs',
        'To delete variables from memory',
        'To turn off loop execution'
      ],
      a: 0,
      hint: 'Why would you wrap a calculation in `def normalize(x):` instead of copying and pasting the formula 20 times?',
      explain: 'Functions defined with `def` modularize code into reusable, testable blocks that accept parameters and return computed outputs.'
    }
  ],
  'ai-m2-t2.2': [
    {
      q: 'Why are NumPy arrays (`ndarray`) preferred over standard Python lists for Machine Learning math?',
      o: [
        'NumPy stores contiguous typed memory and runs vectorized C/Fortran operations without slow Python loops',
        'NumPy arrays can only hold 3 numbers',
        'Python lists cannot store numbers'
      ],
      a: 0,
      hint: 'Compare adding two 10,000-element arrays element-by-element in a Python `for` loop versus a single vectorized `a + b` operation in C.',
      explain: 'NumPy arrays use contiguous homogeneous memory blocks and execute vectorized operations in compiled C code, delivering orders-of-magnitude speedups over Python loops.'
    },
    {
      q: 'If a NumPy array `X` has shape `(100, 4)` in a dataset, what do `100` and `4` typically represent?',
      o: [
        '100 samples (rows) and 4 features (columns) per sample',
        '100 neural networks and 4 computers',
        '4 samples and 100 labels'
      ],
      a: 0,
      hint: 'In a 2D feature matrix X, rows correspond to observations and columns correspond to measured variables.',
      explain: 'By convention in tabular ML datasets, a 2D array of shape (N, D) represents N data samples (rows) each described by D features (columns).'
    }
  ],
  'ai-m3-t3.1': [
    {
      q: 'In a single neuron or linear model, what operation combines input feature vector x and weight vector w?',
      o: [
        'The dot product (w · x = Σ w_i x_i) plus bias b',
        'Alphabetical sorting of variable names',
        'Dividing the vector length by zero'
      ],
      a: 0,
      hint: 'How do you multiply corresponding components of two vectors and sum them into a single weighted score?',
      explain: 'The dot product multiplies each input feature x_i by its corresponding weight w_i and sums the products (w · x + b), forming the core linear combination in regression and neural networks.'
    },
    {
      q: 'For matrix multiplication A @ B to be valid, what condition must their shapes (m, n) and (p, q) satisfy?',
      o: [
        'The inner dimensions must match (n == p), producing an output of shape (m, q)',
        'Both matrices must be 1x1',
        'The outer dimensions must be prime numbers'
      ],
      a: 0,
      hint: 'Each row of A (length n) takes a dot product with each column of B (length p).',
      explain: 'Matrix multiplication requires the number of columns in A (n) to equal the number of rows in B (p), resulting in an output matrix of shape (m, q).'
    }
  ],
  'ai-m3-t3.2': [
    {
      q: 'Which statistical metric measures how spread out sensor or dataset values are around the mean?',
      o: [
        'Standard deviation (σ) / Variance (σ²)',
        'The mode only',
        'The file size in bytes'
      ],
      a: 0,
      hint: 'Two datasets can have the exact same average (mean), but one fluctuates wildly while the other stays tight. What measures that spread?',
      explain: 'Variance averages the squared deviations from the mean, and standard deviation (its square root) expresses that spread in the original units of the data.'
    },
    {
      q: 'What does Bayes’ Theorem calculate in probabilistic AI and sensor fusion?',
      o: [
        'The updated posterior probability P(A|B) of a hypothesis given new observed evidence',
        'The exact battery voltage of a motor',
        'The sorting order of a text file'
      ],
      a: 0,
      hint: 'How should a robot or classifier update its belief when a new sensor reading arrives?',
      explain: 'Bayes’ Theorem updates a prior belief P(A) using the likelihood of new evidence P(B|A) to compute the posterior probability P(A|B).'
    }
  ],
  'ai-m4-t4.1': [
    {
      q: 'What distinguishes Supervised Learning from Unsupervised Learning?',
      o: [
        'Supervised learning trains on labeled input-output pairs (X, y); Unsupervised learning discovers hidden structure or clusters in unlabeled data (X)',
        'Supervised learning requires a human to click a mouse for every prediction',
        'Unsupervised learning only works on text files'
      ],
      a: 0,
      hint: 'Ask yourself: does the training dataset include ground-truth target labels y, or only raw inputs X?',
      explain: 'Supervised learning maps inputs X to known target labels y (regression or classification), whereas Unsupervised learning finds patterns such as clusters (K-Means) or lower-dimensional representations without labels.'
    },
    {
      q: 'Why do we split a dataset into a Training Set and a Test Set?',
      o: [
        'To evaluate how well the trained model generalizes to unseen data and detect overfitting',
        'Because computers cannot load the whole file at once',
        'To delete half of the features'
      ],
      a: 0,
      hint: 'If a student memorizes the exact practice test questions, how do you know if they truly understand the subject?',
      explain: 'Holding out an unseen Test Set lets us measure generalization performance and catch overfitting (when a model memorizes training noise instead of learning the true pattern).'
    }
  ],
  'ai-m4-t4.2': [
    {
      q: 'What type of target output does a Regression model predict?',
      o: [
        'A continuous numerical value (such as temperature in °C, house price, or motor RPM)',
        'Only a binary yes/no category',
        'An unsorted list of strings'
      ],
      a: 0,
      hint: 'Contrast predicting a continuous quantity on a number line with picking a discrete class label.',
      explain: 'Regression predicts continuous numeric quantities (e.g., predicting distance, voltage, or price), whereas classification predicts discrete categories.'
    },
    {
      q: 'What does Mean Squared Error (MSE) measure when fitting a linear regression line ŷ = wx + b?',
      o: [
        'The average of the squared differences between actual values y and predicted values ŷ',
        'The number of features in the dataset',
        'The execution speed of Python'
      ],
      a: 0,
      hint: 'For each data point, the residual error is (y - ŷ). Why do we square and average those errors?',
      explain: 'MSE computes (1/N) Σ (y_i - ŷ_i)², penalizing larger prediction errors more heavily and providing a smooth loss surface for gradient descent.'
    }
  ],
  'ai-m4-t4.3': [
    {
      q: 'In binary classification, what role does the Sigmoid function play in Logistic Regression?',
      o: [
        'It squashes any real-valued linear score z into a probability between 0 and 1',
        'It multiplies the input by 1,000',
        'It converts images into audio'
      ],
      a: 0,
      hint: 'A raw linear score z = w·x + b can be any number from -∞ to +∞. How do we turn that into a valid probability?',
      explain: 'The sigmoid function σ(z) = 1 / (1 + e^-z) maps any real number into the range (0, 1), which can then be compared against a decision threshold (e.g., 0.5) to assign a class.'
    },
    {
      q: 'When detecting rare hardware faults (where 99% of samples are normal), why is raw Accuracy misleading compared to Precision and Recall?',
      o: [
        'A model that blindly predicts "Normal" every time gets 99% accuracy while missing 100% of actual faults (0% recall)',
        'Accuracy cannot be calculated on binary data',
        'Precision and Recall do not use True Positives'
      ],
      a: 0,
      hint: 'Imagine 99 normal motors and 1 failing motor. What accuracy do you get if your model always says "Normal"?',
      explain: 'On imbalanced datasets, raw accuracy hides failure on the minority class. Recall measures what fraction of actual faults were caught, and Precision measures what fraction of fault alarms were real.'
    }
  ],
  'ai-m4-t4.4': [
    {
      q: 'In an end-to-end ML capstone pipeline, what is the correct sequence of stages?',
      o: [
        'Deploy model → Collect data → Delete test set',
        'Problem definition & data inspection → Preprocessing & train/test split → Model training → Evaluation on test set → Prediction/Deployment',
        'Fit on test data → Evaluate on training data only'
      ],
      a: 1,
      hint: 'Why must data cleaning and splitting happen before fitting the model parameters?',
      explain: 'A rigorous ML workflow inspects and cleans the data, splits into train/test sets to prevent data leakage, fits the model on training data, evaluates metrics on unseen test data, and then deploys.'
    },
    {
      q: 'What is "data leakage" in a Machine Learning project?',
      o: [
        'Accidentally using information from the test set or future target during training/preprocessing, leading to artificially inflated metrics',
        'Saving a CSV file to disk',
        'Plotting a scatter chart'
      ],
      a: 0,
      hint: 'What happens if you compute feature scaling across the entire dataset *before* splitting out the test set?',
      explain: 'Data leakage occurs when test-set statistics or target variables leak into training features, causing overly optimistic validation scores that fail in real-world deployment.'
    }
  ],

  // === MECHATRONICS (11 PDF TOPICS) ===
  'mechatronics-m1-t1.1': [
    {
      q: 'What are the four core engineering pillars that combine to form a Mechatronic system?',
      o: [
        'Mechanical, Electrical/Electronic, Control Systems, and Computer/Software Engineering',
        'Civil, Chemical, Agricultural, and Mining Engineering',
        'Graphic Design, Accounting, Marketing, and Legal'
      ],
      a: 0,
      hint: 'Look at the Venn diagram in Topic 1.1: which four disciplines overlap at the center of Mechatronics?',
      explain: 'Mechatronics integrates Mechanical structures, Electrical/Electronic circuits, Control algorithms, and Software/Computing into a unified intelligent machine.'
    },
    {
      q: 'In the mechatronic sense–think–act loop, which component performs the "think" stage?',
      o: [
        'The microcontroller or embedded processor running control software',
        'The aluminum chassis frame',
        'The rubber wheel tire'
      ],
      a: 0,
      hint: 'Sensors gather inputs ("sense") and actuators move the hardware ("act"). What processes the sensor data to command the actuators?',
      explain: 'The controller (such as an Arduino, STM32, or onboard computer) reads sensor inputs, executes control logic, and outputs drive signals to actuators.'
    }
  ],
  'mechatronics-m1-t1.2': [
    {
      q: 'What makes a modern automobile’s Anti-lock Braking System (ABS) a closed-loop mechatronic system?',
      o: [
        'It continuously measures wheel-speed sensors, detects wheel lockup in the ECU, and modulates hydraulic brake valves in milliseconds',
        'It uses only a mechanical cable with no sensors',
        'It requires the driver to pump the brakes manually without electronics'
      ],
      a: 0,
      hint: 'Identify the sensor, the controller, and the actuator working together in real-time feedback.',
      explain: 'ABS is a classic closed-loop mechatronic system: wheel speed sensors provide feedback to the ECU, which rapidly actuates solenoid valves to prevent skidding.'
    },
    {
      q: 'How does an open-loop system differ from a closed-loop system?',
      o: [
        'An open-loop system acts without sensor feedback to verify the output; a closed-loop system measures the actual output and corrects errors',
        'An open-loop system has no power supply',
        'A closed-loop system cannot use motors'
      ],
      a: 0,
      hint: 'Compare a simple toaster timer (which runs for 2 minutes regardless of toast color) with a thermostat-controlled oven.',
      explain: 'Closed-loop systems use feedback sensors to compare actual output against the desired setpoint and automatically correct disturbances.'
    }
  ],
  'mechatronics-m1-t1.3': [
    {
      q: 'Why does the Mechatronics Design Process emphasize concurrent (integrated) engineering over isolated sequential design?',
      o: [
        'Designing mechanical, electrical, and software subsystems together prevents late integration failures like motors that cannot fit or sensors that lack pins',
        'So that software engineers never have to talk to hardware engineers',
        'To skip testing and prototyping'
      ],
      a: 0,
      hint: 'What happens if the mechanical team finishes the robot housing before checking how big the battery and PCB are?',
      explain: 'Concurrent mechatronic design co-optimizes mechanical packaging, power budgets, sensor placement, and control software from day one, avoiding costly redesigns.'
    },
    {
      q: 'In the V-Model of mechatronic system development, what follows subsystem implementation?',
      o: [
        'Unit testing, subsystem integration testing, and full system validation against requirements',
        'Immediately shipping without turning the power on',
        'Discarding the requirements document'
      ],
      a: 0,
      hint: 'The left side of the V decomposes requirements into design; what does the right side of the V do?',
      explain: 'The right side of the V-Model systematically verifies each component and integrates the mechanical, electrical, and software layers against the original specifications.'
    }
  ],
  'mechatronics-m2-t2.1': [
    {
      q: 'According to Ohm’s Law (V = I × R), if a 5 V microcontroller pin drives a 250 Ω resistor, how much current flows?',
      o: [
        '0.02 A (20 mA)',
        '1,250 A',
        '50 A'
      ],
      a: 0,
      hint: 'Rearrange V = I × R to solve for current: I = V / R = 5 V / 250 Ω.',
      explain: 'By Ohm’s Law, I = V / R = 5 V / 250 Ω = 0.02 A = 20 mA, which is a safe current level for a standard LED and GPIO pin.'
    },
    {
      q: 'In the hydraulic (water pipe) analogy of electricity, what do Voltage, Current, and Resistance correspond to?',
      o: [
        'Voltage = water pressure, Current = flow rate, Resistance = pipe narrowing/constriction',
        'Voltage = pipe length, Current = water color, Resistance = tank temperature',
        'Voltage = flow rate, Current = pressure, Resistance = battery size'
      ],
      a: 0,
      hint: 'What pushes the charge through the wire, what measures how much charge passes per second, and what opposes that flow?',
      explain: 'Voltage (Volts) is electrical potential pressure, Current (Amperes) is the rate of charge flow, and Resistance (Ohms) opposes the flow.'
    }
  ],
  'mechatronics-m2-t2.2': [
    {
      q: 'What stays the same across all components connected in a Series circuit vs. a Parallel circuit?',
      o: [
        'In Series, the same Current flows through every component; in Parallel, the same Voltage appears across every branch',
        'In Series, Voltage is identical across unequal resistors; in Parallel, Current is always zero',
        'Series circuits have multiple independent paths for current'
      ],
      a: 0,
      hint: 'In a single-loop series path, charge has only one road to follow. In parallel branches connected across the same two nodes, what is shared?',
      explain: 'Series components share a single current path (I_total = I_1 = I_2) while dividing voltage; Parallel branches share the same node voltage (V_total = V_1 = V_2) while dividing current.'
    },
    {
      q: 'If two 100 Ω resistors are connected in parallel, what is their equivalent resistance R_eq?',
      o: [
        '50 Ω',
        '200 Ω',
        '10,000 Ω'
      ],
      a: 0,
      hint: 'Adding a second parallel branch gives current twice as many paths to flow. Use R_eq = (R1 × R2) / (R1 + R2).',
      explain: 'For two equal resistors in parallel, R_eq = (100 × 100) / (100 + 100) = 50 Ω. Parallel resistance is always smaller than the smallest individual branch resistor.'
    }
  ],
  'mechatronics-m2-t2.3': [
    {
      q: 'Why must you place a current-limiting resistor in series with an LED?',
      o: [
        'Once forward-biased above its threshold voltage, an LED has very low resistance and will draw excessive current and burn out without a resistor',
        'To change the LED into a capacitor',
        'Because LEDs only work on alternating current (AC)'
      ],
      a: 0,
      hint: 'Look at a diode’s I-V curve: once forward voltage (~2V) is reached, current shoots up exponentially.',
      explain: 'A series resistor drops the excess supply voltage (V_s - V_f) and limits current to a safe value (typically 10–20 mA): R = (V_s - V_f) / I.'
    },
    {
      q: 'Why is a flyback diode placed in parallel across a DC motor or relay coil?',
      o: [
        'To safely dissipate the high-voltage inductive kickback spike generated when current to the coil is suddenly switched off',
        'To make the motor spin twice as fast',
        'To block all current when the motor is running normally'
      ],
      a: 0,
      hint: 'Motor windings are inductors. What happens to voltage (V = L di/dt) when current is abruptly interrupted?',
      explain: 'When a transistor switches off an inductive coil, collapsing magnetic flux induces a reverse voltage spike that can destroy the transistor; a flyback diode provides a safe recirculation path.'
    }
  ],
  'mechatronics-m2-t2.4': [
    {
      q: 'How must a digital multimeter (DMM) be connected to measure Voltage vs. Current in a circuit?',
      o: [
        'Measure Voltage in parallel across the component; measure Current in series by breaking the circuit path',
        'Measure Voltage in series and Current in parallel across the battery terminals',
        'Always measure Resistance while high power is turned on'
      ],
      a: 0,
      hint: 'A voltmeter has very high internal impedance, whereas an ammeter has near-zero internal resistance. What happens if you put an ammeter directly across a battery?',
      explain: 'Voltmeters connect in parallel across two points; ammeters must be placed in series so circuit current flows through the meter’s shunt. Connecting an ammeter in parallel creates a dangerous short circuit!'
    },
    {
      q: 'When reading a component datasheet, why must you distinguish "Absolute Maximum Ratings" from "Recommended Operating Conditions"?',
      o: [
        'Absolute Maximum Ratings are stress limits beyond which permanent damage occurs; reliable designs operate within Recommended Operating Conditions',
        'Absolute Maximum Ratings are the normal everyday target values',
        'Datasheets only list mechanical dimensions'
      ],
      a: 0,
      hint: 'Does a chip guarantee accurate operation right at the edge of its destruction limit?',
      explain: 'Engineers always design within the Recommended Operating Conditions (with safety margin/derating) and never intentionally operate at Absolute Maximum stress limits.'
    }
  ],
  'mechatronics-m3-t3.1': [
    {
      q: 'What is the fundamental difference between an Analog sensor and a Digital sensor?',
      o: [
        'An analog sensor outputs a continuous voltage/signal proportional to the physical quantity; a digital sensor outputs discrete states (HIGH/LOW) or binary packets',
        'Analog sensors only work underwater',
        'Digital sensors cannot be connected to a microcontroller'
      ],
      a: 0,
      hint: 'Compare a potentiometer or thermistor (smoothly varying voltage) with a pushbutton switch (ON or OFF).',
      explain: 'Analog sensors produce a continuous signal across a range, whereas digital sensors output discrete logic levels (0/1) or serialized digital words (via I2C/SPI/UART).'
    },
    {
      q: 'What does an Analog-to-Digital Converter (ADC) do inside a microcontroller?',
      o: [
        'It samples a continuous analog voltage (e.g., 0–5 V) and quantizes it into a discrete integer (e.g., 0–1023 for a 10-bit ADC)',
        'It converts a 5 V battery into a 220 V AC motor',
        'It deletes noise without sampling'
      ],
      a: 0,
      hint: 'A 10-bit ADC has 2^10 = 1024 discrete levels. What integer does 2.5 V produce on a 0–5 V scale?',
      explain: 'An N-bit ADC maps an input voltage between 0 V and V_ref into an integer from 0 to (2^N - 1). On a 10-bit 5 V Arduino ADC, 2.5 V reads ~512.'
    }
  ],
  'mechatronics-m3-t3.2': [
    {
      q: 'How does an ultrasonic distance sensor (like the HC-SR04) calculate distance to an obstacle?',
      o: [
        'It measures the round-trip time-of-flight of an ultrasonic sound pulse and divides by 2: d = (v_sound × t) / 2',
        'It measures the color of the object using red light',
        'It weighs the robot chassis'
      ],
      a: 0,
      hint: 'The sound wave travels from the sensor to the wall AND bounces back to the receiver. Why must you divide by 2?',
      explain: 'Because the measured echo pulse duration t covers the out-and-back path (2d), distance to the target is d = (0.0343 cm/µs × t_µs) / 2.'
    },
    {
      q: 'Which sensor is used on a motor shaft to measure exact wheel rotation counts, speed, and direction?',
      o: [
        'A rotary encoder (optical or magnetic quadrature encoder)',
        'A thermistor',
        'A barometric pressure sensor'
      ],
      a: 0,
      hint: 'Which sensor generates pulse trains (channels A and B) as a slotted disk or magnet spins on the shaft?',
      explain: 'Quadrature rotary encoders output pulses per revolution on two phase-shifted channels (A and B), allowing the microcontroller to track both angular position/speed and rotation direction.'
    }
  ],
  'mechatronics-m3-t3.3': [
    {
      q: 'Why do we use a pull-up or pull-down resistor on a digital input pin connected to a pushbutton?',
      o: [
        'To prevent the input pin from "floating" at an undefined voltage when the button is open, which causes random false triggers',
        'To make the button physically harder to press',
        'To increase the clock speed of the CPU'
      ],
      a: 0,
      hint: 'When a switch is open, an unconnected CMOS input pin acts like a tiny antenna picking up electrical noise.',
      explain: 'A pull-up or pull-down resistor weakly ties the pin to a known logic state (VCC or GND) when the switch is open, ensuring clean, reliable transitions when pressed.'
    },
    {
      q: 'What is "switch bounce" and how is it handled when reading mechanical buttons?',
      o: [
        'Mechanical contacts physically rebound for a few milliseconds when pressed, producing multiple rapid spikes that are filtered using hardware RC filters or software debounce delays',
        'When a robot physically jumps off the table',
        'When a battery runs out of charge'
      ],
      a: 0,
      hint: 'To a microcontroller running at 16 MHz, a 5-millisecond physical contact chatter looks like dozens of button presses.',
      explain: 'Debouncing (either waiting ~10–50 ms in software to confirm a stable state or using an RC low-pass filter) prevents a single button press from registering multiple times.'
    }
  ],
  'mechatronics-m4-t4.1': [
    {
      q: 'Why can you NOT power a DC motor directly from a microcontroller GPIO pin?',
      o: [
        'A GPIO pin can only safely source ~20–40 mA, whereas a motor requires hundreds of milliamps or amps plus back-EMF protection via a motor driver (H-Bridge/MOSFET)',
        'Because GPIO pins output alternating current only',
        'Because motors only run on Wi-Fi signals'
      ],
      a: 0,
      hint: 'Compare the current rating of an Arduino digital pin (~20 mA) with the stall current of even a small hobby DC motor (~500–1000 mA).',
      explain: 'In the Controller → Driver → Actuator chain, the microcontroller outputs low-current logic/PWM signals to a driver (MOSFET or H-Bridge), which switches high current from the power supply to the motor.'
    },
    {
      q: 'How does an H-Bridge motor driver control both the direction and speed of a brushed DC motor?',
      o: [
        'It switches diagonal pairs of transistors to reverse polarity (direction) and uses Pulse Width Modulation (PWM) duty cycle to vary average voltage (speed)',
        'It physically swaps the battery wires using a servo',
        'It changes the resistance of the copper windings'
      ],
      a: 0,
      hint: 'Think of the letter H with the motor across the center bar and 4 switches on the legs.',
      explain: 'Closing switches S1+S4 drives current forward; closing S2+S3 reverses current; and pulsing the switches with PWM controls average motor power and speed.'
    }
  ],

  // === ROBOTICS PID DEFAULT LESSON ===
  'robotics-pid': [
    {
      q: 'Quick check: In a PID controller, which term reacts to the rate of change of error to dampen oscillation and reduce overshoot?',
      o: [
        'P (Proportional)',
        'I (Integral)',
        'D (Derivative)'
      ],
      a: 2,
      hint: 'Which term acts like a shock absorber or brake as the error rapidly approaches zero?',
      explain: 'The Derivative (D) term is proportional to de(t)/dt. As the robot rapidly approaches the setpoint, the error decreases quickly (negative slope), so D applies a braking correction that prevents overshoot.'
    },
    {
      q: 'What problem does the Integral (I) term solve when a robot arm or motor has a persistent steady-state offset?',
      o: [
        'It accumulates error over time (∫ e(t) dt) and increases control effort until the steady-state error reaches zero',
        'It turns off the motor when it gets close',
        'It measures battery temperature'
      ],
      a: 0,
      hint: 'If gravity pulls a robot arm slightly below target and P alone isn’t strong enough to close the tiny remaining gap, what happens as that small error adds up over time?',
      explain: 'Even a small persistent error accumulates over time in the Integral sum, steadily boosting motor command until the steady-state offset is eliminated.'
    }
  ]
};

export const QUIZ_DECKS = {
  daily: {
    id: 'daily',
    title: 'Daily quiz',
    subtitle: '5 questions · +50 XP',
    xpReward: 50,
    questions: [
      {
        q: QUIZ_QUESTIONS[0][0],
        o: QUIZ_QUESTIONS[0][1],
        a: QUIZ_QUESTIONS[0][2],
        hint: 'Think about echolocation—which sensor sends out a high-frequency acoustic pulse and times the echo?',
        explain: 'An ultrasonic sensor (such as the HC-SR04) emits a 40 kHz sound wave and measures the echo time-of-flight to calculate distance.'
      },
      {
        q: QUIZ_QUESTIONS[1][0],
        o: QUIZ_QUESTIONS[1][1],
        a: QUIZ_QUESTIONS[1][2],
        hint: 'When a fast-moving robot approaches its target line, what happens if it doesn’t slow down in time?',
        explain: 'The Derivative (D) term responds to the rate of error change, acting as a damper that slows the correction near the target to reduce overshoot.'
      },
      {
        q: QUIZ_QUESTIONS[2][0],
        o: QUIZ_QUESTIONS[2][1],
        a: QUIZ_QUESTIONS[2][2],
        hint: 'Sensors observe the environment; resistors limit current. Which component converts energy into physical motion?',
        explain: 'An actuator (such as a DC motor, servo, stepper motor, or hydraulic cylinder) converts electrical/fluid energy into mechanical movement.'
      },
      {
        q: QUIZ_QUESTIONS[3][0],
        o: QUIZ_QUESTIONS[3][1],
        a: QUIZ_QUESTIONS[3][2],
        hint: 'An Arduino is a microcontroller board with flash memory and pins for inputs and outputs.',
        explain: 'An Arduino executes a compiled C/C++ program (sketch) in a continuous setup() and loop() cycle to read sensors and control hardware.'
      },
      {
        q: QUIZ_QUESTIONS[4][0],
        o: QUIZ_QUESTIONS[4][1],
        a: QUIZ_QUESTIONS[4][2],
        hint: 'Volts measure potential difference and Ohms measure resistance. Which unit measures charge flow per second?',
        explain: 'Electric current (I) is measured in Amperes (Amps, A), where 1 A = 1 Coulomb of charge flowing per second.'
      }
    ]
  },
  sensors: {
    id: 'sensors',
    title: 'Sensors Quiz',
    subtitle: 'Mechatronics Module 3 · +60 XP',
    xpReward: 60,
    questions: [
      ...TOPIC_CHECKPOINTS['mechatronics-m3-t3.1'],
      ...TOPIC_CHECKPOINTS['mechatronics-m3-t3.2'],
      ...TOPIC_CHECKPOINTS['mechatronics-m3-t3.3']
    ]
  },
  pid: {
    id: 'pid',
    title: 'PID & Control Basics',
    subtitle: 'Robotics & Control · +60 XP',
    xpReward: 60,
    questions: [
      ...TOPIC_CHECKPOINTS['robotics-pid'],
      ...TOPIC_CHECKPOINTS['mechatronics-m1-t1.2'],
      ...TOPIC_CHECKPOINTS['mechatronics-m4-t4.1']
    ]
  },
  ai: {
    id: 'ai',
    title: 'AI Algorithms Quiz',
    subtitle: 'AI Basics Modules 1–4 · +80 XP',
    xpReward: 80,
    questions: [
      TOPIC_CHECKPOINTS['ai-m1-t1.1'][0],
      TOPIC_CHECKPOINTS['ai-m2-t2.2'][0],
      TOPIC_CHECKPOINTS['ai-m3-t3.1'][0],
      TOPIC_CHECKPOINTS['ai-m4-t4.1'][0],
      TOPIC_CHECKPOINTS['ai-m4-t4.2'][1],
      TOPIC_CHECKPOINTS['ai-m4-t4.3'][0]
    ]
  },
  circuits: {
    id: 'circuits',
    title: 'Circuits Quiz',
    subtitle: 'Mechatronics Module 2 · +60 XP',
    xpReward: 60,
    questions: [
      ...TOPIC_CHECKPOINTS['mechatronics-m2-t2.1'],
      ...TOPIC_CHECKPOINTS['mechatronics-m2-t2.2'],
      TOPIC_CHECKPOINTS['mechatronics-m2-t2.3'][0],
      TOPIC_CHECKPOINTS['mechatronics-m2-t2.4'][0]
    ]
  }
};

// Maps each project track key and station index to the relevant course lessons
export const PROJECT_LESSON_BRIDGES = {
  obstacle: {
    projectTitle: 'Obstacle-Avoiding Robot',
    summary: 'Apply Mechatronics sensors, actuators, and PID/control logic to build an autonomous mobile robot.',
    stations: [
      {
        stepIndex: 0,
        stationTitle: 'Plan and parts',
        courseKey: 'mechatronics',
        lessonStepIndex: 2,
        lessonLabel: 'Mechatronics 1.3: Design Process',
        buildTip: 'Select chassis, HC-SR04 ultrasonic sensor, L298N H-bridge driver, 2 DC gearmotors, and battery pack.'
      },
      {
        stepIndex: 1,
        stationTitle: 'Wire the sensor',
        courseKey: 'mechatronics',
        lessonStepIndex: 8,
        lessonLabel: 'Mechatronics 3.2: Common Sensor Types',
        buildTip: 'Wire HC-SR04 VCC to 5V, GND to GND, Trig to D9, and Echo to D10.'
      },
      {
        stepIndex: 2,
        stationTitle: 'Code the motors',
        courseKey: 'mechatronics',
        lessonStepIndex: 10,
        lessonLabel: 'Mechatronics 4.1: What Is an Actuator?',
        buildTip: 'Connect H-bridge ENA/ENB to PWM pins and IN1–IN4 to direction pins to drive forward, reverse, and turn.'
      },
      {
        stepIndex: 3,
        stationTitle: 'Obstacle logic',
        courseKey: 'ai',
        lessonStepIndex: 3,
        lessonLabel: 'AI 2.1: Python & Control Logic',
        buildTip: 'If measured distance < 20 cm, stop, reverse briefly, scan left/right, and turn toward the clear path.'
      },
      {
        stepIndex: 4,
        stationTitle: 'Test and tune',
        courseKey: 'robotics',
        lessonStepIndex: 3,
        lessonLabel: 'Robotics: Control and PID',
        buildTip: 'Tune turn duration and PWM duty cycle so the robot avoids obstacles smoothly without wheel slip.'
      },
      {
        stepIndex: 5,
        stationTitle: 'Demo day',
        courseKey: 'mechatronics',
        lessonStepIndex: 1,
        lessonLabel: 'Mechatronics 1.2: Real-World Systems',
        buildTip: 'Run a full obstacle-course trial and share your build in Community!'
      }
    ]
  },
  linecar: {
    projectTitle: 'Line-Following Car',
    summary: 'Combine IR reflectance sensors, ADC threshold comparison, and motor PWM steering.',
    stations: [
      {
        stepIndex: 0,
        stationTitle: 'Build the chassis',
        courseKey: 'mechatronics',
        lessonStepIndex: 0,
        lessonLabel: 'Mechatronics 1.1: What Is Mechatronics?',
        buildTip: 'Mount differential drive motors, caster wheel, and downward-facing IR sensor array 5 mm above the track.'
      },
      {
        stepIndex: 1,
        stationTitle: 'Wire the IR sensors',
        courseKey: 'mechatronics',
        lessonStepIndex: 7,
        lessonLabel: 'Mechatronics 3.1: Analog vs. Digital Sensors',
        buildTip: 'Connect left and right IR photodiode modules to analog input pins A0 and A1.'
      },
      {
        stepIndex: 2,
        stationTitle: 'Code the line logic',
        courseKey: 'robotics',
        lessonStepIndex: 3,
        lessonLabel: 'Robotics: Control and PID',
        buildTip: 'Compute steering error = leftSensor - rightSensor and adjust left/right motor PWM speeds proportionally.'
      },
      {
        stepIndex: 3,
        stationTitle: 'Race test',
        courseKey: 'mechatronics',
        lessonStepIndex: 10,
        lessonLabel: 'Mechatronics 4.1: What Is an Actuator?',
        buildTip: 'Increase base speed and derivative damping (Kd) to handle sharp S-curves without overshooting the line.'
      }
    ]
  },
  temp: {
    projectTitle: 'Temperature Alarm',
    summary: 'Build an analog sensor conditioning circuit with microcontroller ADC thresholding and buzzer actuation.',
    stations: [
      {
        stepIndex: 0,
        stationTitle: 'Pick the parts',
        courseKey: 'mechatronics',
        lessonStepIndex: 5,
        lessonLabel: 'Mechatronics 2.3: Essential Components',
        buildTip: 'Gather TMP36/NTC temperature sensor, current-limiting resistors, red warning LED, piezo buzzer, and Arduino.'
      },
      {
        stepIndex: 1,
        stationTitle: 'Connect the sensor',
        courseKey: 'mechatronics',
        lessonStepIndex: 6,
        lessonLabel: 'Mechatronics 2.4: Datasheets & Multimeters',
        buildTip: 'Verify sensor pinout in the datasheet and check 5V supply and analog output voltage with a multimeter.'
      },
      {
        stepIndex: 2,
        stationTitle: 'Read the temperature',
        courseKey: 'mechatronics',
        lessonStepIndex: 9,
        lessonLabel: 'Mechatronics 3.3: Reading Sensor Data',
        buildTip: 'Convert 10-bit analogRead(A0) into voltage V = raw * (5.0 / 1023.0) and calculate temperature in °C.'
      },
      {
        stepIndex: 3,
        stationTitle: 'Add the buzzer alarm',
        courseKey: 'mechatronics',
        lessonStepIndex: 3,
        lessonLabel: 'Mechatronics 2.1: Voltage, Current & Resistance',
        buildTip: 'Drive the LED through a 220 Ω resistor and trigger the piezo buzzer when temperature exceeds the threshold.'
      },
      {
        stepIndex: 4,
        stationTitle: 'Enclosure and test',
        courseKey: 'ai',
        lessonStepIndex: 9,
        lessonLabel: 'AI 4.3: Classification & Thresholds',
        buildTip: 'Add hysteresis to the threshold so noise near 35°C does not cause rapid alarm chatter.'
      }
    ]
  }
};

// Maps course keys to recommended hands-on projects for "Learning-to-Building" bridges
export const COURSE_TO_PROJECT_MAP = {
  mechatronics: {
    projectKey: 'obstacle',
    projectTitle: 'Obstacle-Avoiding Robot',
    secondaryProjectKey: 'temp',
    secondaryProjectTitle: 'Temperature Alarm',
    reason: 'Apply Mechatronics sensors, voltage dividers, H-bridge motor drivers, and control loops directly to a mobile robot build.'
  },
  ai: {
    projectKey: 'obstacle',
    projectTitle: 'Obstacle-Avoiding Robot',
    secondaryProjectKey: 'linecar',
    secondaryProjectTitle: 'Line-Following Car',
    reason: 'Connect Python control logic, threshold classification, and sensor decision trees to real hardware autonomy.'
  },
  robotics: {
    projectKey: 'linecar',
    projectTitle: 'Line-Following Car',
    secondaryProjectKey: 'obstacle',
    secondaryProjectTitle: 'Obstacle-Avoiding Robot',
    reason: 'Use proportional-derivative (PD/PID) feedback control to steer a differential-drive robot along a track.'
  },
  drone: {
    projectKey: 'obstacle',
    projectTitle: 'Obstacle-Avoiding Robot',
    secondaryProjectKey: 'linecar',
    secondaryProjectTitle: 'Line-Following Car',
    reason: 'Apply propulsion, battery power budgeting, and closed-loop sensor stabilization to an autonomous build.'
  },
  micro: {
    projectKey: 'temp',
    projectTitle: 'Temperature Alarm',
    secondaryProjectKey: 'obstacle',
    secondaryProjectTitle: 'Obstacle-Avoiding Robot',
    reason: 'Practice Arduino analogRead() 10-bit ADC conversion, digital GPIO outputs, and threshold alarms.'
  },
  elec: {
    projectKey: 'temp',
    projectTitle: 'Temperature Alarm',
    secondaryProjectKey: 'linecar',
    secondaryProjectTitle: 'Line-Following Car',
    reason: 'Build a real series current-limiting LED & buzzer circuit driven by an analog temperature sensor.'
  },
  sensors: {
    projectKey: 'obstacle',
    projectTitle: 'Obstacle-Avoiding Robot',
    secondaryProjectKey: 'temp',
    secondaryProjectTitle: 'Temperature Alarm',
    reason: 'Wire HC-SR04 ultrasonic and IR sensors into a microcontroller and actuate motors based on live distance data.'
  }
};

