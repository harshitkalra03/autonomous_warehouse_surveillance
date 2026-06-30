# Autonomous Warehouse Surveillance

A ROS-based autonomous warehouse surveillance robot designed for autonomous navigation, environment mapping, obstacle avoidance, remote monitoring, and real-time data logging.

The project consists of both the complete software stack (ROS workspaces) and the hardware design files (mechanical CAD, electrical schematics, BOM, and demonstration videos).

---

# Features

- Autonomous Navigation
- SLAM Mapping
- Obstacle Avoidance & Recovery
- Remote Monitoring
- Real-Time Data Logging
- Custom Mechanical Design
- Custom Electronics Integration
- ESP32-based Motor Control
- Hardware Safety Circuit (Emergency Stop)

---

# Repository Structure

```
.
├── onboard/
│   └── ros_workspace/
│
├── offboard/
│   └── ros_workspace/
│
├── hardware/
│   ├── CAD Models
│   ├── Assemblies
│   ├── Drawings
│   ├── Lifting Mechanism
│   └── Mechanical Components
│
├── Electrical Schematics/
│
├── Demo/
│
├── Videos/
│
├── BOM_Itemized.csv
│
├── 99_m1_eternal-1.pdf
│
└── README.md
```

---

# Software

The software is divided into two ROS workspaces.

## Onboard Workspace

Location:

```
onboard/ros_workspace
```

Contains

- Robot Control
- Sensor Drivers
- Navigation
- SLAM
- Motor Interface
- Hardware Communication

---

## Offboard Workspace

Location:

```
offboard/ros_workspace
```

Contains

- Monitoring Interface
- Remote Control
- Data Logging
- Visualization
- Operator Side ROS Packages

---

# Hardware

The `hardware/` directory contains all mechanical design resources used during the project.

Contents include

- SolidWorks Parts (.SLDPRT)
- SolidWorks Assemblies (.SLDASM)
- Mechanical Drawings
- Camera Mount
- Lifting Mechanism
- Structural Components
- CAD Assemblies

Folder:

```
hardware/
```

---

# Electrical Schematics

Electrical design documents are available in

```
Electrical Schematics/
```

This includes

- High-Level Block Diagram
- ESP32 Pinout
- Motor Driver Connections
- Emergency Stop Circuit
- Motor Control Circuit
- Communication Interfaces

---

# Bill of Materials (BOM)

The complete itemized Bill of Materials is available here

```
BOM_Itemized.csv
```

The BOM includes

- Mechanical Components
- Electronics
- Fasteners
- Sensors
- Motors
- Bearings
- Structural Parts

---

# Project Report

The complete project report can be found here

```
99_m1_eternal-1.pdf
```

---

# Demonstration

## Demo

Contains screenshots and demonstration media.

```
Demo/
```

## Videos

Contains project demonstration videos including

- SLAM Mapping
- Navigation
- Obstacle Avoidance
- Vertical Mechanism
- Scanning Mechanism
- Real-Time Data Logging

```
Videos/
```

---

# Git LFS

Some large files (such as videos and CAD resources) are stored using **Git Large File Storage (Git LFS)**.

If you are cloning this repository for the first time, install Git LFS before cloning or pulling large files.

```
git lfs install
```

Git LFS will automatically download the required large files during clone or pull.

For more information:

https://git-lfs.com/

---

# Getting Started

Clone the repository

```bash
git clone https://github.com/harshitkalra03/autonomous_warehouse_surveillance.git
```

Move into the repository

```bash
cd autonomous_warehouse_surveillance
```

If using Git LFS

```bash
git lfs install
git lfs pull
```

---

# Authors

## Eternals Team – Inter IIT Tech Meet 14.0

**Institute:** Indian Institute of Technology Ropar

### Team Members

1. Syed Naqi Abbas
2. Harshit Kalra
3. Shlok Narayan Vaidya
4. Gouri Chandra Tiwary
5. Pratik Hadiya
6. Piyush Goyal
