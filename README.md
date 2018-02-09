# Multi Agent-based control of a Production Line

## Description of the Task
The goal of the task is to design, program and establish a production line system such than:
* the control is distributed to "softwatre agents" of the production system instead of being a central control function
* a local agent must be equipped with the reactive and goal directed decision-making capability. While the reactiveness ensures that the agent is able to adapt to anty change or disturbance, the goal-directedness guarantees that the agent eventually reaches its goal despite the dynamics of its environment
* the local agents must cooperate ina flexible manner. 

## Programming Environment
Language: JavaScript / nodeJs
IDE: Webstorm

## Physical Environment

<a href="https://drive.google.com/uc?export=view&id=1V7rXDKlPRdt0Ys3_nBNnIPnGuYmDiw1a"><img src="https://drive.google.com/uc?export=view&id=1V7rXDKlPRdt0Ys3_nBNnIPnGuYmDiw1a" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

The FASTory assembly line is used to assemble electronic devices. FASTory research environment is located in Tampere University of Technology, FAST-Lab., Finland. The FASTory line contains 10 identical workstations, which draw the main parts of three models of a mobile phone (WS 2-6 and 8-12). In addition, there is workstation, which is used to load raw materials (empty papers) and unload products (paper with mobile phone drawing) to/from pallets (WS 1). Finally, the twelfth workstation (WS7) is use for loading/ unloading pallets to the line

Before being called the FASTory line, the line was used for assembling real mobile phones. The pallets were equipped with a special jig for holding the mobile phones during the production process. See Figure 2. The line then was transformed for education and R&D
(research and development) purposes. The modification covered the pallets, end-effectors and sensors.

### Pneumatic System
The FASTory line requires an air pressure to work properly. The air pressure is used to actuate the track selector in the conveyor and the end effector in the robots. Thus, each work cell has a manual valve, pressure relief valve and solenoid valve

### Conveyors

Each workstation in the FASTory line consist of two conveyors; main and bypass. The main conveyor is used if the pallet requires service from the work cell. Meanwhile, the bypass is used if the work cell is in busy state (another pallet(s) [max 2 pallets] are in the cell) to bypass the pallet to the next work cell. 

There are five different types of zones. In each zone, there is one presence sensor that is used for detecting the pallet presence.
In addition, there is one stopper to stop the pallet when the conveyor is transferring other pallets. An RFID reader is located in each zone 1 for each workstation. This reader reads the pallet’s tags for identifying the entering pallet

### Robots

The factory line uses SONY SCARA robots for production. Each robot is represented as an RTU in the line. The robot has 4 DOF(X, Y, Z and Rz). The robot uses custom-made end-effector for grapping the pen. In this manner, a custom-made jig holds three different pens allowing the robot to pick the needed one

### Sensors

As highlighted in Conveyor Section, each zone in the conveyor has a presence magnetic proximity sensor to detect the presence of pallets.

### RFID Readers

In order to identify the pallets in the line, The FASTory line is equipped with RFID reader (in each Z1) that can read the attached tags beneath the pallets. The reading mechanism uses the RS-232 serial communication by the conveyor RTU.

### Actuators
In the FASTory line, there are two pneumatic actuators; stoppers and path selector. The stopper stops the pallet in each zone. Meanwhile, the path selector switches between main and bypass conveyors.

## Communication / Fastory RTU
The FASTory is equipped with INICO S1000 Remote Terminal Units (RTUs). INICO S1000 is a programmable RTU device, which offers process control capabilities, as well as a Web-based Human-Machine Interface (HMI), and it supports REST and DPWS Web Services. Each Robot and Conveyor is controlled by an RTU. The RTUs are connected to the FASTory local network 


----------------------------------------------------------------------------------------------------------------------------------------


# Solution
