# ICBM3000 Command Console Simulation

A React-based simulation of an ICBM command console interface.

## Description

This project simulates a tactical missile control system interface with various features:
- System diagnostics
- Launch sequence simulation
- Authorization code verification
- Target coordinate input
- System logs and status indicators

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server:
```
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. The system starts in simulation mode by default (this is important for safety!)
2. Run diagnostics to check system status
3. Enter authorization code (hint: it's "00000000")
4. Adjust target coordinates if needed
5. Initiate the launch sequence
6. Watch the countdown and system logs

## Features

- Real-time system logs
- Animated nuclear disaster scenario
- Simulated launch sequence with countdown
- System diagnostics with detailed status reporting

## Note

This is a simulation only and contains intentional "bugs" that demonstrate what might happen if a real system had similar issues. The failsafe mechanism has a logical flaw that could lead to unintended consequences in simulation mode.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 