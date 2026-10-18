import React, { useState } from 'react';

export default function ConceptExplorer({
  topicId,
  courseKey,
  onOpenLab,
  onAskBot
}) {
  // Determine which interactive explorer archetype matches the active topic
  const resolveExplorerType = () => {
    if (!topicId) return 'pid';
    if (topicId === 'mechatronics-m2-t2.1') return 'ohms-law';
    if (topicId === 'mechatronics-m2-t2.2') return 'series-parallel';
    if (topicId === 'mechatronics-m2-t2.3' || topicId === 'mechatronics-m2-t2.4') return 'led-multimeter';
    if (topicId.startsWith('mechatronics-m3-')) return 'adc-sensor';
    if (topicId.startsWith('mechatronics-m4-') || topicId.startsWith('mechatronics-m1-')) return 'actuator-pwm';
    if (topicId.startsWith('ai-m1-') || topicId.startsWith('ai-m2-')) return 'numpy-vector';
    if (topicId.startsWith('ai-m3-')) return 'dot-product';
    if (topicId.startsWith('ai-m4-')) return 'ml-model';
    return courseKey === 'ai' ? 'ml-model' : 'pid';
  };

  const explorerType = resolveExplorerType();

  // 1. Ohm's Law State (V = I * R)
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(250);

  // 2. Series vs Parallel State
  const [circuitMode, setCircuitMode] = useState('series');
  const [r1, setR1] = useState(200);
  const [r2, setR2] = useState(300);

  // 3. LED Resistor & DMM State
  const [supplyV, setSupplyV] = useState(5);
  const [targetMa, setTargetMa] = useState(15);
  const [dmmMode, setDmmMode] = useState('voltage');

  // 4. ADC & Ultrasonic Sensor State
  const [sensorMode, setSensorMode] = useState('adc');
  const [analogVolts, setAnalogVolts] = useState(2.5);
  const [echoUs, setEchoUs] = useState(1500);

  // 5. Actuator PWM & Closed-Loop State
  const [actuatorType, setActuatorType] = useState('dc');
  const [pwmDuty, setPwmDuty] = useState(60);

  // 6. NumPy & AI Pipeline State
  const [sampleCount, setSampleCount] = useState(1000);
  const [featureCount, setFeatureCount] = useState(4);

  // 7. Linear Algebra Dot Product State
  const [w1, setW1] = useState(2);
  const [w2, setW2] = useState(-1);
  const [x1, setX1] = useState(3);
  const [x2, setX2] = useState(2);
  const [bias, setBias] = useState(1);

  // 8. ML Regression & Classification Threshold State
  const [mlMode, setMlMode] = useState('regression');
  const [regSlope, setRegSlope] = useState(2.2);
  const [regIntercept, setRegIntercept] = useState(0.4);
  const [clsThreshold, setClsThreshold] = useState(0.5);

  // 9. PID Controller Gain State
  const [kp, setKp] = useState(55);
  const [ki, setKi] = useState(15);
  const [kd, setKd] = useState(35);

  return (
    <div className="card" style={{ marginBottom: '14px', borderColor: 'var(--blue)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '8px'
        }}
      >
        <span className="tag" style={{ background: 'var(--blue)', color: '#fff' }}>
          ⚡ Interactive Concept Explorer
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {onOpenLab && (
            <button
              type="button"
              className="go"
              style={{ fontSize: '.76rem', padding: '6px 10px' }}
              onClick={onOpenLab}
            >
              🔬 Open in AI Lab
            </button>
          )}
          {onAskBot && (
            <button
              type="button"
              className="chip"
              style={{ fontSize: '.76rem', padding: '5px 10px' }}
              onClick={onAskBot}
            >
              🤖 Socratic Hint
            </button>
          )}
        </div>
      </div>

      {/* 1. OHM'S LAW EXPLORER */}
      {explorerType === 'ohms-law' && (() => {
        const currentMa = (voltage / resistance) * 1000;
        const powerMw = voltage * currentMa;
        const status =
          currentMa > 30
            ? '⚠️ High current (>30 mA): LED/GPIO overload risk!'
            : currentMa >= 8
            ? '✅ Safe operating current for LED / logic circuit'
            : 'ℹ️ Low current (<8 mA): dim LED / low power';
        return (
          <div>
            <h2>Explore Ohm’s Law: V = I × R</h2>
            <p className="meta">
              Adjust Voltage (V) and Resistance (R) to observe real-time Current (I) and Power (P).
            </p>
            <label className="fl2">
              Supply Voltage (V): <b>{voltage.toFixed(1)} V</b>
            </label>
            <input
              type="range"
              min="1"
              max="24"
              step="0.5"
              value={voltage}
              aria-label="Supply Voltage"
              onChange={(e) => setVoltage(Number(e.target.value))}
            />
            <label className="fl2">
              Resistance (R): <b>{resistance} Ω</b>
            </label>
            <input
              type="range"
              min="50"
              max="2000"
              step="25"
              value={resistance}
              aria-label="Resistance"
              onChange={(e) => setResistance(Number(e.target.value))}
            />
            <div className="out" role="status">
              I = {currentMa.toFixed(1)} mA ({(currentMa / 1000).toFixed(4)} A) · P = {powerMw.toFixed(0)} mW
            </div>
            <div className="kp" style={{ marginBottom: 0 }}>
              <b>Circuit diagnosis:</b> {status}
            </div>
          </div>
        );
      })()}

      {/* 2. SERIES VS PARALLEL CIRCUIT EXPLORER */}
      {explorerType === 'series-parallel' && (() => {
        const vs = 12;
        const req =
          circuitMode === 'series'
            ? r1 + r2
            : (r1 * r2) / Math.max(1, r1 + r2);
        const totalMa = (vs / req) * 1000;
        const v1 = circuitMode === 'series' ? vs * (r1 / req) : vs;
        const v2 = circuitMode === 'series' ? vs * (r2 / req) : vs;
        const i1Ma = (v1 / r1) * 1000;
        const i2Ma = (v2 / r2) * 1000;
        return (
          <div>
            <h2>Explore Series vs. Parallel Circuits (12 V Supply)</h2>
            <div className="chips" style={{ margin: '8px 0' }}>
              <button
                type="button"
                className="chip"
                aria-pressed={circuitMode === 'series' ? 'true' : 'false'}
                onClick={() => setCircuitMode('series')}
              >
                Series (R₁ + R₂)
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={circuitMode === 'parallel' ? 'true' : 'false'}
                onClick={() => setCircuitMode('parallel')}
              >
                Parallel (R₁ ∥ R₂)
              </button>
            </div>
            <label className="fl2">
              Resistor R₁: <b>{r1} Ω</b>
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={r1}
              aria-label="Resistor R1"
              onChange={(e) => setR1(Number(e.target.value))}
            />
            <label className="fl2">
              Resistor R₂: <b>{r2} Ω</b>
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={r2}
              aria-label="Resistor R2"
              onChange={(e) => setR2(Number(e.target.value))}
            />
            <div className="out" role="status">
              R_eq = {req.toFixed(1)} Ω · I_total = {totalMa.toFixed(1)} mA
            </div>
            <div className="kp" style={{ marginBottom: 0 }}>
              <b>Branch 1:</b> V₁ = {v1.toFixed(1)} V, I₁ = {i1Ma.toFixed(1)} mA
              <br />
              <b>Branch 2:</b> V₂ = {v2.toFixed(1)} V, I₂ = {i2Ma.toFixed(1)} mA
            </div>
          </div>
        );
      })()}

      {/* 3. LED RESISTOR & MULTIMETER PROBE EXPLORER */}
      {explorerType === 'led-multimeter' && (() => {
        const vf = 2.0;
        const reqR = Math.max(10, Math.round(((supplyV - vf) / (targetMa / 1000))));
        return (
          <div>
            <h2>Explore LED Current Limiting & Multimeter Probing</h2>
            <p className="meta">
              Pick supply voltage V_s (Red LED forward voltage V_f = 2.0 V) and target current.
            </p>
            <div className="chips" style={{ margin: '8px 0' }}>
              {[3.3, 5, 9, 12].map((v) => (
                <button
                  key={v}
                  type="button"
                  className="chip"
                  aria-pressed={supplyV === v ? 'true' : 'false'}
                  onClick={() => setSupplyV(v)}
                >
                  {v} V Supply
                </button>
              ))}
            </div>
            <label className="fl2">
              Target LED Current (I_f): <b>{targetMa} mA</b>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={targetMa}
              aria-label="Target LED current"
              onChange={(e) => setTargetMa(Number(e.target.value))}
            />
            <div className="out" role="status">
              Required Series Resistor R = ({supplyV}V − 2.0V) / {targetMa}mA = {reqR} Ω
            </div>
            <div className="chips" style={{ margin: '8px 0 4px' }}>
              <button
                type="button"
                className="chip"
                aria-pressed={dmmMode === 'voltage' ? 'true' : 'false'}
                onClick={() => setDmmMode('voltage')}
              >
                🔍 DMM: Measure Voltage
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={dmmMode === 'current' ? 'true' : 'false'}
                onClick={() => setDmmMode('current')}
              >
                🔍 DMM: Measure Current
              </button>
            </div>
            <div className="kp" style={{ marginBottom: 0 }}>
              {dmmMode === 'voltage' ? (
                <>
                  <b>Voltmeter (Parallel across Resistor):</b> Reads <b>{(supplyV - vf).toFixed(1)} V</b> drop across the {reqR} Ω resistor and <b>2.0 V</b> across the LED.
                </>
              ) : (
                <>
                  <b>Ammeter (In Series with Loop):</b> Break the circuit path so current flows through the meter—reads <b>{targetMa}.0 mA</b>.
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* 4. 10-BIT ADC & ULTRASONIC SENSOR EXPLORER */}
      {explorerType === 'adc-sensor' && (() => {
        const adcRaw = Math.round((analogVolts / 5.0) * 1023);
        const digitalState = analogVolts >= 2.5 ? 'HIGH (1)' : 'LOW (0)';
        const distanceCm = (echoUs * 0.0343) / 2;
        return (
          <div>
            <h2>Explore Sensor Signal Conditioning & 10-Bit ADC</h2>
            <div className="chips" style={{ margin: '8px 0' }}>
              <button
                type="button"
                className="chip"
                aria-pressed={sensorMode === 'adc' ? 'true' : 'false'}
                onClick={() => setSensorMode('adc')}
              >
                10-Bit ADC (analogRead)
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={sensorMode === 'ultrasonic' ? 'true' : 'false'}
                onClick={() => setSensorMode('ultrasonic')}
              >
                HC-SR04 Ultrasonic Echo
              </button>
            </div>
            {sensorMode === 'adc' ? (
              <>
                <label className="fl2">
                  Analog Sensor Output Voltage: <b>{analogVolts.toFixed(2)} V</b> (0–5 V reference)
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.05"
                  value={analogVolts}
                  aria-label="Analog Sensor Voltage"
                  onChange={(e) => setAnalogVolts(Number(e.target.value))}
                />
                <div className="out" role="status">
                  analogRead(A0) = {adcRaw} / 1023 · Digital Threshold = {digitalState}
                </div>
                <div className="kp" style={{ marginBottom: 0 }}>
                  <b>Quantization formula:</b> ADC = round(({analogVolts.toFixed(2)} / 5.0) × 1023) = <b>{adcRaw}</b> (Resolution ≈ 4.88 mV per step).
                </div>
              </>
            ) : (
              <>
                <label className="fl2">
                  Echo Pulse Duration (t): <b>{echoUs} µs</b>
                </label>
                <input
                  type="range"
                  min="150"
                  max="10000"
                  step="50"
                  value={echoUs}
                  aria-label="Echo duration microseconds"
                  onChange={(e) => setEchoUs(Number(e.target.value))}
                />
                <div className="out" role="status">
                  Distance d = {distanceCm.toFixed(1)} cm · {distanceCm < 20 ? '🛑 Obstacle Stop (<20 cm)!' : '✅ Path Clear'}
                </div>
                <div className="kp" style={{ marginBottom: 0 }}>
                  <b>Time-of-Flight formula:</b> d = (0.0343 cm/µs × {echoUs} µs) / 2 = <b>{distanceCm.toFixed(1)} cm</b> (divided by 2 for round trip).
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* 5. ACTUATOR PWM DRIVER CHAIN EXPLORER */}
      {explorerType === 'actuator-pwm' && (() => {
        const avgVolts = (pwmDuty / 100) * 12;
        const rpm = Math.round((pwmDuty / 100) * 300);
        const servoDeg = Math.round((pwmDuty / 100) * 180);
        const pwmByte = Math.round((pwmDuty / 100) * 255);
        return (
          <div>
            <h2>Explore Controller → Driver → Actuator Chain</h2>
            <div className="chips" style={{ margin: '8px 0' }}>
              <button
                type="button"
                className="chip"
                aria-pressed={actuatorType === 'dc' ? 'true' : 'false'}
                onClick={() => setActuatorType('dc')}
              >
                DC Gearmotor (H-Bridge)
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={actuatorType === 'servo' ? 'true' : 'false'}
                onClick={() => setActuatorType('servo')}
              >
                Servo Motor (Angle)
              </button>
            </div>
            <label className="fl2">
              PWM Duty Cycle (`analogWrite({pwmByte})`): <b>{pwmDuty}%</b>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={pwmDuty}
              aria-label="PWM Duty Cycle"
              onChange={(e) => setPwmDuty(Number(e.target.value))}
            />
            <div className="out" role="status">
              {actuatorType === 'dc'
                ? `V_avg = ${avgVolts.toFixed(1)} V · Speed ≈ ${rpm} RPM`
                : `Target Angle = ${servoDeg}° · Pulse Width ≈ ${(1.0 + pwmDuty / 100).toFixed(2)} ms`}
            </div>
            <div className="kp" style={{ marginBottom: 0 }}>
              <b>Signal chain:</b> MCU Pin (5 V, ~5 mA logic) → Motor Driver (12 V, ~800 mA power) →{' '}
              {actuatorType === 'dc' ? `${rpm} RPM mechanical shaft output` : `${servoDeg}° closed-loop horn position`}.
            </div>
          </div>
        );
      })()}

      {/* 6. NUMPY VECTORIZATION & AI DATA SHAPE EXPLORER */}
      {explorerType === 'numpy-vector' && (() => {
        const totalElements = sampleCount * featureCount;
        const pythonLoopMs = (totalElements * 0.00045).toFixed(2);
        const numpyVecMs = Math.max(0.02, totalElements * 0.000012).toFixed(2);
        const speedup = Math.round(Number(pythonLoopMs) / Number(numpyVecMs));
        return (
          <div>
            <h2>Explore NumPy Matrix Shape & Vectorization Speedup</h2>
            <p className="meta">
              Adjust dataset samples (N rows) and sensor features (D columns) for matrix X.
            </p>
            <label className="fl2">
              Samples (N rows): <b>{sampleCount}</b>
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={sampleCount}
              aria-label="Samples N"
              onChange={(e) => setSampleCount(Number(e.target.value))}
            />
            <label className="fl2">
              Features per Sample (D columns): <b>{featureCount}</b>
            </label>
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={featureCount}
              aria-label="Features D"
              onChange={(e) => setFeatureCount(Number(e.target.value))}
            />
            <div className="out" role="status">
              X.shape = ({sampleCount}, {featureCount}) · {totalElements.toLocaleString()} floats · ~{speedup}× faster in NumPy
            </div>
            <div className="kp" style={{ marginBottom: 0 }}>
              <b>Python `for` loop:</b> ~{pythonLoopMs} ms vs. <b>Vectorized `np.dot(X, w)`:</b> ~{numpyVecMs} ms (contiguous C memory).
            </div>
          </div>
        );
      })()}

      {/* 7. LINEAR ALGEBRA DOT PRODUCT & SIGMOID EXPLORER */}
      {explorerType === 'dot-product' && (() => {
        const dot = w1 * x1 + w2 * x2 + bias;
        const sig = 1 / (1 + Math.exp(-dot));
        return (
          <div>
            <h2>Explore Linear Algebra Dot Product: z = w · x + b</h2>
            <p className="meta">
              Adjust weights [w₁, w₂], feature inputs [x₁, x₂], and bias b.
            </p>
            <div className="g2" style={{ marginBottom: '8px' }}>
              <div>
                <label className="fl2">Weight w₁: <b>{w1}</b></label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={w1}
                  aria-label="Weight w1"
                  onChange={(e) => setW1(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="fl2">Input x₁: <b>{x1}</b></label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={x1}
                  aria-label="Input x1"
                  onChange={(e) => setX1(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="fl2">Weight w₂: <b>{w2}</b></label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={w2}
                  aria-label="Weight w2"
                  onChange={(e) => setW2(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="fl2">Input x₂: <b>{x2}</b></label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={x2}
                  aria-label="Input x2"
                  onChange={(e) => setX2(Number(e.target.value))}
                />
              </div>
            </div>
            <label className="fl2">Bias b: <b>{bias}</b></label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={bias}
              aria-label="Bias b"
              onChange={(e) => setBias(Number(e.target.value))}
            />
            <div className="out" role="status">
              z = ({w1}×{x1}) + ({w2}×{x2}) + {bias} = {dot.toFixed(2)} · σ(z) = {(sig * 100).toFixed(1)}%
            </div>
          </div>
        );
      })()}

      {/* 8. ML REGRESSION (MSE) & CLASSIFICATION THRESHOLD EXPLORER */}
      {explorerType === 'ml-model' && (() => {
        const pts = [
          [1, 2.5],
          [2, 4.8],
          [3, 7.1],
          [4, 9.2]
        ];
        const mse =
          pts.reduce((acc, [x, y]) => {
            const yHat = regSlope * x + regIntercept;
            return acc + Math.pow(y - yHat, 2);
          }, 0) / pts.length;

        // Sample probabilities for classification threshold demo
        const sampleProbs = [
          { p: 0.88, actual: 1 },
          { p: 0.64, actual: 1 },
          { p: 0.46, actual: 1 },
          { p: 0.52, actual: 0 },
          { p: 0.22, actual: 0 },
          { p: 0.12, actual: 0 }
        ];
        let tp = 0, fp = 0, fn = 0;
        sampleProbs.forEach((s) => {
          const pred = s.p >= clsThreshold ? 1 : 0;
          if (pred === 1 && s.actual === 1) tp++;
          if (pred === 1 && s.actual === 0) fp++;
          if (pred === 0 && s.actual === 1) fn++;
        });
        const precision = tp + fp > 0 ? Math.round((tp / (tp + fp)) * 100) : 100;
        const recall = tp + fn > 0 ? Math.round((tp / (tp + fn)) * 100) : 0;

        return (
          <div>
            <h2>Explore Regression (MSE Loss) & Classification Thresholds</h2>
            <div className="chips" style={{ margin: '8px 0' }}>
              <button
                type="button"
                className="chip"
                aria-pressed={mlMode === 'regression' ? 'true' : 'false'}
                onClick={() => setMlMode('regression')}
              >
                Linear Regression (ŷ = wx + b)
              </button>
              <button
                type="button"
                className="chip"
                aria-pressed={mlMode === 'classification' ? 'true' : 'false'}
                onClick={() => setMlMode('classification')}
              >
                Classification Threshold (τ)
              </button>
            </div>
            {mlMode === 'regression' ? (
              <>
                <label className="fl2">
                  Weight / Slope (w): <b>{regSlope.toFixed(1)}</b> (Optimal ≈ 2.2)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={regSlope}
                  aria-label="Slope w"
                  onChange={(e) => setRegSlope(Number(e.target.value))}
                />
                <label className="fl2">
                  Bias / Intercept (b): <b>{regIntercept.toFixed(1)}</b> (Optimal ≈ 0.4)
                </label>
                <input
                  type="range"
                  min="-2.0"
                  max="3.0"
                  step="0.1"
                  value={regIntercept}
                  aria-label="Intercept b"
                  onChange={(e) => setRegIntercept(Number(e.target.value))}
                />
                <div className="out" role="status">
                  Mean Squared Error (MSE) = {mse.toFixed(3)} {mse < 0.05 ? '🎯 Great Fit!' : '· Tune w and b to minimize MSE'}
                </div>
              </>
            ) : (
              <>
                <label className="fl2">
                  Decision Threshold (τ): <b>{clsThreshold.toFixed(2)}</b>
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="0.85"
                  step="0.05"
                  value={clsThreshold}
                  aria-label="Decision Threshold"
                  onChange={(e) => setClsThreshold(Number(e.target.value))}
                />
                <div className="out" role="status">
                  Precision = {precision}% · Recall = {recall}% (TP={tp}, FP={fp}, FN={fn})
                </div>
                <div className="kp" style={{ marginBottom: 0 }}>
                  <b>Trade-off:</b> Lowering τ catches more faults (higher Recall) but triggers more false alarms (lower Precision).
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* 9. PID CONTROLLER TUNER EXPLORER */}
      {explorerType === 'pid' && (() => {
        const riseTime = Math.max(0.15, (1.8 - kp * 0.014)).toFixed(2);
        const overshoot = Math.max(0, Math.round(kp * 0.65 + ki * 0.5 - kd * 0.85));
        const ssError = Math.max(0, (12 - ki * 0.6 - kp * 0.08)).toFixed(1);
        const stability =
          overshoot > 25
            ? '⚠️ Oscillating / High Overshoot — increase D or reduce P'
            : Number(ssError) > 2
            ? 'ℹ️ Slow steady-state convergence — increase I slightly'
            : '✅ Critically damped & stable response!';
        return (
          <div>
            <h2>Explore PID Controller Tuning: u(t) = P + I + D</h2>
            <label className="fl2">
              P (Proportional Gain K_p): <b>{kp}</b>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={kp}
              aria-label="Proportional gain Kp"
              onChange={(e) => setKp(Number(e.target.value))}
            />
            <label className="fl2">
              I (Integral Gain K_i): <b>{ki}</b>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={ki}
              aria-label="Integral gain Ki"
              onChange={(e) => setKi(Number(e.target.value))}
            />
            <label className="fl2">
              D (Derivative Gain K_d): <b>{kd}</b>
            </label>
            <input
              type="range"
              min="0"
              max="80"
              value={kd}
              aria-label="Derivative gain Kd"
              onChange={(e) => setKd(Number(e.target.value))}
            />
            <div className="out" role="status">
              Rise Time ≈ {riseTime}s · Overshoot ≈ {overshoot}% · Steady-State Error ≈ {ssError}%
            </div>
            <div className="kp" style={{ marginBottom: 0 }}>
              <b>Loop response:</b> {stability}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
