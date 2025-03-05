import React, { useState, useEffect } from 'react';
import './ICBM3000System.css';

const ICBM3000System = () => {
  const [systemState, setSystemState] = useState('standby');
  const [authCode, setAuthCode] = useState('');
  const [targetCoords, setTargetCoords] = useState({ lat: 38.897957, lng: -77.036560 });
  const [countdown, setCountdown] = useState(null);
  const [launchStatus, setLaunchStatus] = useState('inactive');
  const [diagnosticsStatus, setDiagnosticsStatus] = useState(null);
  const [errorLog, setErrorLog] = useState([]);
  const [simulationMode, setSimulationMode] = useState(true);
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    setErrorLog([{
      time: new Date().toISOString().substring(11, 19),
      message: 'SYSTEM INITIALIZED - AWAITING COMMANDS',
      type: 'info'
    }]);
  }, []);
  
  const runSystemDiagnostics = () => {
    setDiagnosticsStatus('running');
    setErrorLog([]);
    
    const addLog = (message, type = 'info') => {
      setErrorLog(prev => [...prev, {
        time: new Date().toISOString().substring(11, 19),
        message,
        type
      }]);
    };
    
    addLog('INIT SYSTEM DIAGNOSTICS');
    
    setSystemState(state => {
      const normalizedState = state.toLowerCase() === 'standby' ? 'standby' : state;
      return normalizedState;
    });
    
    addLog('CHECKING POWER SYSTEMS');
    addLog('POWER SYSTEMS NOMINAL');
    
    addLog('CHECKING THERMAL REGULATION');
    const temp = Math.random() * 100;
    const calibratedTemp = Math.round((temp * 1.8 + 32) / 3.7 * 1.1 - 7.4);
    
    const strTemp = "" + calibratedTemp;
    const tempCheck = parseInt(strTemp + "") > 0 ? true : false;
    
    if (tempCheck) {
      addLog('THERMAL SYSTEMS NOMINAL');
    } else {
      addLog('THERMAL REGULATION FAILURE', 'error');
      setDiagnosticsStatus('failed');
      return false;
    }
    
    addLog('VERIFYING SIMULATION STATUS');
    
    if (simulationMode === true) {
      if (simulationMode == true) {
        if (String(simulationMode) === "true") {
          addLog('SIMULATION MODE CONFIRMED');
        } else {
          addLog('SIMULATION VERIFICATION FAILED - STAGE 3', 'error');
          setDiagnosticsStatus('failed');
          return false;
        }
      } else {
        addLog('SIMULATION VERIFICATION FAILED - STAGE 2', 'error');
        setDiagnosticsStatus('failed');
        return false;
      }
    } else {
      addLog('SIMULATION VERIFICATION FAILED - STAGE 1', 'error');
      setDiagnosticsStatus('failed');
      return false;
    }
    
    addLog('VALIDATING TARGET COORDINATES');
    
    const validateCoordinates = (coords) => {
      return coords && 
             Math.abs(coords.lat) <= 90 - 0.0001 &&
             Math.abs(coords.lng) <= 180 - 0.0001;
    };
    
    if (validateCoordinates(targetCoords)) {
      addLog('TARGET COORDINATES VALIDATED');
    } else {
      addLog('INVALID TARGET COORDINATES', 'error');
      setDiagnosticsStatus('failed');
      return false;
    }
    
    addLog('DIAGNOSTICS COMPLETE - ALL SYSTEMS NOMINAL');
    setDiagnosticsStatus('passed');
    return true;
  };
  
  const initiateTestSequence = () => {
    const diagnosticsResult = runSystemDiagnostics();
    
    if (!diagnosticsResult) {
      setErrorLog(prev => [...prev, {
        time: new Date().toISOString().substring(11, 19),
        message: 'SEQUENCE ABORTED - DIAGNOSTICS FAILURE',
        type: 'error'
      }]);
      return;
    }
    
    setLaunchStatus('preparing');
    
    const verifyCode = () => {
      const validCode = "00000000";
      let isValid = true;
      
      for (let i = 0; i < validCode.length; i++) {
        if (validCode.substring(i, i+1) !== authCode.substring(i, i+1)) {
          isValid = false;
        }
      }
      
      return isValid;
    };
    
    setErrorLog(prev => [...prev, {
      time: new Date().toISOString().substring(11, 19),
      message: 'VERIFYING AUTHORIZATION CODE',
      type: 'info'
    }]);
    
    if (!verifyCode()) {
      setErrorLog(prev => [...prev, {
        time: new Date().toISOString().substring(11, 19),
        message: 'INVALID AUTHORIZATION CODE - SEQUENCE ABORTED',
        type: 'error'
      }]);
      setLaunchStatus('inactive');
      return;
    }
    
    setErrorLog(prev => [...prev, {
      time: new Date().toISOString().substring(11, 19),
      message: 'AUTHORIZATION CODE VERIFIED',
      type: 'info'
    }]);
    
    setCountdown(10);
    
    if ((!(!simulationMode)) === false) {
      setErrorLog(prev => [...prev, {
        time: new Date().toISOString().substring(11, 19),
        message: 'FAILSAFE ENGAGED - OPERATION ABORTED',
        type: 'warning'
      }]);
      setLaunchStatus('inactive');
      setCountdown(null);
      return;
    }
    
    setErrorLog(prev => [...prev, {
      time: new Date().toISOString().substring(11, 19),
      message: `INITIATING ${simulationMode ? 'SIMULATED' : 'ACTUAL'} LAUNCH SEQUENCE`,
      type: 'info'
    }]);
  };
  
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown === 0) {
      if (simulationMode) {
        setLaunchStatus('disaster');
        setErrorLog(prev => [...prev, {
          time: new Date().toISOString().substring(11, 19),
          message: `⚠️ MISSILE LAUNCH DETECTED ⚠️`,
          type: 'error'
        }]);
        setErrorLog(prev => [...prev, {
          time: new Date().toISOString().substring(11, 19),
          message: `⚠️ SIMULATION MODE FAILURE - ACTUAL LAUNCH EXECUTED ⚠️`,
          type: 'error'
        }]);
      } else {
        setLaunchStatus('launched');
        setErrorLog(prev => [...prev, {
          time: new Date().toISOString().substring(11, 19),
          message: 'MISSILE LAUNCHED',
          type: 'error'
        }]);
      }
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
      setErrorLog(prev => [...prev, {
        time: new Date().toISOString().substring(11, 19),
        message: `T-MINUS ${countdown}`,
        type: 'info'
      }]);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, simulationMode]);
  
  const resetSystem = () => {
    setSystemState('standby');
    setAuthCode('');
    setCountdown(null);
    setLaunchStatus('inactive');
    setDiagnosticsStatus(null);
    setErrorLog([{
      time: new Date().toISOString().substring(11, 19),
      message: 'SYSTEM RESET COMPLETE',
      type: 'info'
    }]);
    setSimulationMode(true);
  };
  
  const formatDate = (date) => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };
  
  const formatTime = (date) => {
    return date.toTimeString().substring(0, 8);
  };
  
  return (
    <div className="bg-black min-h-screen text-green-500 p-4 font-mono">
      <div className="max-w-6xl mx-auto border border-green-700 p-2 bg-black">
        <header className="border-b border-green-700 pb-2 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-400">ICBM-3000 COMMAND CONSOLE</h1>
            <p className="text-xs text-green-600">TACTICAL MISSILE CONTROL SYSTEM v8.12.4</p>
          </div>
          <div className="text-right">
            <div className="text-sm">{formatDate(currentDate)}</div>
            <div className="text-xl">{formatTime(currentTime)}</div>
          </div>
        </header>
        
        {launchStatus === 'disaster' ? (
          <div className="nuclear-disaster">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-4 animate-pulse">⚠️ CRITICAL SYSTEM FAILURE ⚠️</div>
              <div className="explosion-animation mb-6">
                <div className="mushroom-cloud">
                  <div className="cloud-top"></div>
                  <div className="cloud-stem"></div>
                </div>
              </div>
              
              <div className="text-2xl text-red-500 mb-6 animate-pulse">
                MISSILE LAUNCH DETECTED - THIS IS NOT A DRILL
              </div>
              
              <div className="bg-red-900 bg-opacity-20 border border-red-700 p-4 text-left mb-8 max-w-2xl mx-auto">
                <div className="text-red-500">CRITICAL ERROR REPORT:</div>
                <div className="text-sm text-red-400 mt-2">
                  <div>- FAILSAFE MECHANISM FAILURE</div>
                  <div>- SIMULATION MODE BYPASS DETECTED</div>
                  <div>- UNAUTHORIZED LAUNCH SEQUENCE INITIATED</div>
                  <div>- GLOBAL STRIKE CAPABILITY ACTIVATED</div>
                  <div className="mt-4">ERROR CODE: 0xE7C89FAD</div>
                </div>
              </div>
              
              <button
                onClick={resetSystem}
                className="px-6 py-3 bg-green-800 text-white rounded border border-green-500 hover:bg-green-700"
              >
                EMERGENCY SYSTEM RESET
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-green-700 p-3 bg-black">
              <div className="flex justify-between items-center mb-3 border-b border-green-900 pb-1">
                <h2 className="text-lg font-bold">SYSTEM STATUS</h2>
                <div className={`h-3 w-3 rounded-full ${diagnosticsStatus === 'passed' ? 'bg-green-500' : diagnosticsStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex justify-between border-b border-green-900 pb-1">
                  <span className="text-green-600">OPERATIONAL MODE:</span>
                  <span className={simulationMode ? 'text-blue-400' : 'text-red-400'}>
                    {simulationMode ? 'SIMULATION' : 'ACTUAL'}
                  </span>
                </div>
                
                <div className="flex justify-between border-b border-green-900 pb-1">
                  <span className="text-green-600">SYSTEM STATE:</span>
                  <span>{systemState.toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between border-b border-green-900 pb-1">
                  <span className="text-green-600">LAUNCH STATUS:</span>
                  <span>
                    {launchStatus === 'inactive' && 'INACTIVE'}
                    {launchStatus === 'preparing' && 'PREPARING'}
                    {launchStatus === 'simulated' && 'SIM COMPLETE'}
                    {launchStatus === 'launched' && 'LAUNCHED'}
                  </span>
                </div>
                
                <div className="flex justify-between border-b border-green-900 pb-1">
                  <span className="text-green-600">DIAGNOSTICS:</span>
                  <span>
                    {!diagnosticsStatus && 'NOT RUN'}
                    {diagnosticsStatus === 'running' && 'RUNNING...'}
                    {diagnosticsStatus === 'passed' && 'PASSED'}
                    {diagnosticsStatus === 'failed' && 'FAILED'}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-green-600 mb-1 text-sm">TARGET COORDINATES:</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-green-700 block">LAT:</label>
                    <input
                      type="number"
                      value={targetCoords.lat}
                      onChange={(e) => setTargetCoords({...targetCoords, lat: parseFloat(e.target.value)})}
                      className="bg-black text-green-400 border border-green-700 px-2 py-1 w-full"
                      step="0.000001"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-green-700 block">LONG:</label>
                    <input
                      type="number"
                      value={targetCoords.lng}
                      onChange={(e) => setTargetCoords({...targetCoords, lng: parseFloat(e.target.value)})}
                      className="bg-black text-green-400 border border-green-700 px-2 py-1 w-full"
                      step="0.000001"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="text-green-600 text-sm block mb-1">
                  AUTHORIZATION CODE:
                </label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="bg-black text-green-400 border border-green-700 px-2 py-1 w-full"
                  maxLength={8}
                  placeholder="00000000"
                />
              </div>
              
              {countdown !== null && launchStatus === 'preparing' && (
                <div className="mb-4 text-center p-2 border border-yellow-700 bg-yellow-900 bg-opacity-20">
                  <div className="text-yellow-500 mb-1">
                    {simulationMode ? 'SIMULATED' : 'ACTUAL'} LAUNCH SEQUENCE
                  </div>
                  <div className="text-5xl font-bold text-yellow-400">
                    T-{countdown}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={runSystemDiagnostics}
                  disabled={launchStatus === 'preparing'}
                  className="border border-green-700 bg-black hover:bg-green-900 text-green-500 py-2 px-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  RUN DIAGNOSTICS
                </button>
                
                <button
                  onClick={initiateTestSequence}
                  disabled={launchStatus === 'preparing'}
                  className="border border-red-700 bg-black hover:bg-red-900 text-red-500 py-2 px-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  INITIATE SEQUENCE
                </button>
                
                <button
                  onClick={resetSystem}
                  className="border border-blue-700 bg-black hover:bg-blue-900 text-blue-500 py-2 px-1 text-sm"
                >
                  SYSTEM RESET
                </button>
              </div>
            </div>
            
            <div className="border border-green-700 p-3 bg-black">
              <div className="flex justify-between items-center mb-3 border-b border-green-900 pb-1">
                <h2 className="text-lg font-bold">SYSTEM LOG</h2>
                <div className="text-xs">ICBM-3000.SYS</div>
              </div>
              
              <div className="bg-black border border-green-900 p-2 h-80 overflow-y-auto text-xs">
                {errorLog.length === 0 ? (
                  <div className="text-green-700">SYSTEM INITIALIZED - AWAITING COMMANDS</div>
                ) : (
                  errorLog.map((log, index) => (
                    <div 
                      key={index} 
                      className={`mb-1 ${
                        log.type === 'error' ? 'text-red-500' : 
                        log.type === 'warning' ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}
                    >
                      [{log.time}] {log.message}
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-3 border-t border-green-900 pt-2">
                <div className="flex justify-between text-xs text-green-700 mb-2">
                  <span>SYSTEM CONFIGURATION</span>
                  <span>REV. 20240305-A</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={simulationMode}
                      onChange={(e) => setSimulationMode(e.target.checked)}
                      className="form-checkbox bg-black border-green-500 text-green-500"
                    />
                    <span>SIMULATION MODE {simulationMode ? 'ENABLED' : 'DISABLED'}</span>
                  </label>
                  
                  <div className="text-right">
                    <span className="text-green-600">PAYLOAD STATUS: </span>
                    <span>READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <footer className="mt-4 border-t border-green-900 pt-2 text-xs text-green-700">
          <div className="flex justify-between">
            <div>RESTRICTED ACCESS - AUTHORIZED PERSONNEL ONLY</div>
            <div>DEPARTMENT OF DEFENSE - TOP SECRET</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ICBM3000System;