# Multi Agent-based control of a Production Line

## Description of the Task
The goal of the task is to design, program and establish a production line system such that:
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

## System Architecture

<a href="https://drive.google.com/uc?export=view&id=1b6wItfNzCA6-vZX7iZEyihPJSHsglY3E"><img src="https://drive.google.com/uc?export=view&id=1b6wItfNzCA6-vZX7iZEyihPJSHsglY3E" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

## Communication between Agents

<a href="https://drive.google.com/uc?export=view&id=1y5KR5E3pbmoUhtnqDgCfoB5gI62SoKHQ"><img src="https://drive.google.com/uc?export=view&id=1y5KR5E3pbmoUhtnqDgCfoB5gI62SoKHQ" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

## Initial Communications in Lay Man’s Language

<a href="https://drive.google.com/uc?export=view&id=1aQWTb-CYoLTnMB01Tsa-hJ_9p5uZN6ZM"><img src="https://drive.google.com/uc?export=view&id=1aQWTb-CYoLTnMB01Tsa-hJ_9p5uZN6ZM" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

## UML Sequence Diagram
<a href="https://drive.google.com/uc?export=view&id=1KmIwo939gvjbj1L-hX4eO24cYM5YFEeT"><img src="https://drive.google.com/uc?export=view&id=1KmIwo939gvjbj1L-hX4eO24cYM5YFEeT" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>
<a href="https://drive.google.com/uc?export=view&id=1rV8yUNIiCC-ili7CdyzVogdcY-7FY50Y"><img src="https://drive.google.com/uc?export=view&id=1rV8yUNIiCC-ili7CdyzVogdcY-7FY50Y" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

## Detailed Explanation of the System and the  Working Logic

The system consists of 3 Agents, the Order Agent (just one), the Workstation Agent (many) and the Pallet Agent (as many produced). The conveyor and the robots are grouped as one agent called the workstation Agents for simplicity.

In the beginning the user is expected  to place the order the  user interface. 
The order is passed on to the Order Agent which takes care of the rest of the processes. In parallel the order is also saved into the database.
The user is next expected to load a pallet manually on to the line (Fastory Simulator) when the workstation notifies the Order Agent that a new pallet is loaded. The Order Agent next checks for any existing orders and if there are any existing orders, it requests the Pallet Agent to create a pallet which then has a dedicated port at which agents communicate to it. 
The Order Agent passes the attributes of the the particular order which the pallet receives as its properties. At this point it is to note that individual pallets are indeed treated as objects of a class Pallet Agent and each pallet has got its unique port on which it may be contacted to initiate a conversation. 
The Pallet next requests the workstation agent (conveyor) to move it from zones to accomplish its tasks.
On the arrival of a pallet to any zone, the workstation identifies its Pallet ID and requests the Order Agent for the port to initiate communication with it. The Order Agent returns the port no of the pallet after searching the Pallet ID given to it and then workstation then establishes communication with the pallet. It is to be noted that this occurs in every single zone.  
The communication begins by the workstation requesting the current status of the pallet to which the pallet responds. The pallet checks the status and acts intelligently. The following is the sequence of steps:

<a href="https://drive.google.com/uc?export=view&id=1K52gIcP3GM6YjgxQ_r6ROfsEeWQsHW2B"><img src="https://drive.google.com/uc?export=view&id=1K52gIcP3GM6YjgxQ_r6ROfsEeWQsHW2B" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

If the product is at zone3 of workstation 7 and is complete it will unload automatically, otherwise it  continues in the production line. 


# FRONT END DEVELOPMENT

##  User Interface for Customer

<a href="https://drive.google.com/uc?export=view&id=1oT7rw3c9mQKmrl3sbpLjUiQ0gYEsRUgw"><img src="https://drive.google.com/uc?export=view&id=1oT7rw3c9mQKmrl3sbpLjUiQ0gYEsRUgw" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Features of the UI
* Uses Form Validation to not allow users to Place Order without entering vital information such as Name, Address and Phone number
* Uses CSS to remind user of the missing information.
* Enables User to enter multiple orders using the Add Order button
* Allows User to delete and order by ticking a check box and pressing the delete row button in case the user inputs an erroneous order.
* Shows a preview of the Order entered so far.

### How to place an Order
* Fill User details in the Name, Address and Phone number fields
* Select the Order Variant by the drop down menus
* Add multiple Orders using the Add row Button
* Delete any order if necessary by checking the box adjacent to the order and pressing the “delete order button”
* Press the send button to place the order

# MySQL Database

## SQL Table Representations with the queries used to create them

### Customers Table

<a href="https://drive.google.com/uc?export=view&id=1x9nHW3ExRpgz1VTuYCQWE7vMRYAcYe3C"><img src="https://drive.google.com/uc?export=view&id=1x9nHW3ExRpgz1VTuYCQWE7vMRYAcYe3C" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

The Customer Table consists of 5 fields whose Names and Data Types are shown above. The CustomerID Field is the Primary Key of the Table and is set to increment from 1000. The Name Field takes a NOT NULL constraint which simply means that it cannot be left empty. This condition is taken care of the Front End Script( JavaScript and CSS) which does not allow the user to submit if the field is left blank (will be shown in the Front End Development Section of this Paper).

**Queries Used for the Table (multiple queries are used for clarity even though they could be combined:**
* **CREATE TABLE** Customers(Sno **int(5)**, CustomerID **int(5)** **PRIMARY KEY**, Name char(30) **NOT NULL**, Address char(50), TelephoneNo **BIGINT UNSIGNED**);	
* **ALTER TABLE** Customers **MODIFY** CustomerID **INT(5) AUTO_INCREMENT**;
* **ALTER TABLE** Customers **AUTO_INCREMENT**=1000;


### Products Table

<a href="https://drive.google.com/uc?export=view&id=1bOBDb-lTKbmYSoBgVxF4OngSU4sbS_Ag"><img src="https://drive.google.com/uc?export=view&id=1bOBDb-lTKbmYSoBgVxF4OngSU4sbS_Ag" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

* **CREATE TABLE** Products(Sno **INT(5)**, ProductID **int(5) PRIMARY KEY**, ProductID **BIGINT UNSIGNED** FrameType **char(10)**, FrameColour **char(10)**, ScreenType **char(10)**, ScreenColour **char(10)**, KeyboardType **char(10)**, KeyboardColour **char(10)**, Quantity **int(3)**, Status **enum**('ordered','processed','manufactured'));
* **ALTER TABLE** Products **ALTER** Quantity **SET DEFAULT** 1;


### Orders Table

<a href="https://drive.google.com/uc?export=view&id=1VDztKvDc-TmGttaYuOmhrTTszJLDFjy0"><img src="https://drive.google.com/uc?export=view&id=1VDztKvDc-TmGttaYuOmhrTTszJLDFjy0" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

The Orders Table Consists of 6 Fields whose Names and Data Types are shown above. It is to be noted that OrderID field is the Primary Key and is set to Increment at a starting Value of 5000. Also the Date_time field takes a default value of the current time at the time of the order.
Queries Used for the Table:
* **CREATE TABLE** Orders (SNo **int(5)**, OrderID **int(5) PRIMARY KEY**, CustomerID **int(5)**, ProductID **int(5)**, Quantity **int(3)**, Date_time **TIMESTAMP DEFAULT NOW()**);
* **ALTER TABLE** Orders **MODIFY** OrderID **INT(5) AUTO_INCREMENT**;
* **ALTER TABLE** Orders **AUTO_INCREMENT=5000**;



### Pallets Table

<a href="https://drive.google.com/uc?export=view&id=1V0e8_qhrE79PFvAYhGgWKMy2AwqJ1oTJ"><img src="https://drive.google.com/uc?export=view&id=1V0e8_qhrE79PFvAYhGgWKMy2AwqJ1oTJ" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

* **CREATE TABLE** Pallets (OrderID **INT(11)**, ProductID **INT(11)**, PalletID **BIGINT UNSIGNED**, Frame **ENUM**('Yes','No') **DEFAULT** 'No',Keyboard **ENUM** ('Yes','No') **DEFAULT** 'No', Screen  **ENUM** ('Yes','No') **DEFAULT** 'No', Paper  **ENUM** ('Yes','No') **DEFAULT** 'No', Frametype  **VARCHAR(15)**, Framecolour  **VARCHAR(15)**, Screentype **VARCHAR(15)**, Screencolour  **VARCHAR(15)**, Keyboardtype  **VARCHAR(15)**, Keyboardcolour  **VARCHAR(15)**, Status **ENUM**('in_queue',’processed’, 'loaded') **DEFAULT** 'in_queue');

