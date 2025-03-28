// Mapping for sections with their associated tool prefix and sub-sections
const sectionMapping = {
    "WET-CLEAN": {
        prefix: "SCR",
        subSections: ["Front Side", "Back Side"]
    },
    "DRY-ETCH": {
        prefix: "ASH",
        subSections: ["Poly", "Oxide", "Nitride", "Metal"]
    },
    "WET-ETCH": {
        prefix: "ZTA",
        subSections: ["SiO2", "SiN", "Poly", "Metal"]
    },
    "THIN-FILM": {
        prefix: "CVN",
        subSections: ["PVD", "CVD", "ALD"]
    },
    "PHOTO": {
        prefix: "TRC",
        subSections: ["Track", "Stepper", "Developer"]
    },
    "CMP": {
        prefix: "CMA",
        subSections: ["Oxide", "Metal", "STI"]
    },
    "IMPLANT": {
        prefix: "IMP",
        subSections: ["High Current", "Medium Current", "High Energy"]
    },
    "DIFFUSION": {
        prefix: "DIFF",
        subSections: ["RTA", "Furnace", "Annealing"]
    },
    "DEVELOP": {
        prefix: "QUE",
        subSections: ["Developer", "Rinse", "Dry"]
    },
    "YIELD": {
        prefix: "YLD",
        subSections: ["Defect Inspection", "Metrology", "Failure Analysis"]
    },
    "METROLOGY": {
        prefix: "MET",
        subSections: ["CD-SEM", "Overlay", "Film Thickness"]
    },
    "INSPECTION": {
        prefix: "INS",
        subSections: ["Bright Field", "Dark Field", "E-Beam"]
    },
    "TEST": {
        prefix: "TST",
        subSections: ["Probe", "Sort", "Final Test"]
    },
    "PACKAGING": {
        prefix: "PKG",
        subSections: ["Assembly", "Wire Bond", "Final Test"]
    },
    "R&D": {
        prefix: "RND",
        subSections: ["Process Development", "Device Characterization", "Integration"]
    }
};

// Process Flow Definition
const processFlow = {
    "WET-CLEAN": {
        "Front Side Clean": {
            tools: ["SCR01", "SCR02"],
            chambers: {
                "SCR01": ["SCR01-PM1", "SCR01-PM2"],
                "SCR02": ["SCR02-PM1", "SCR02-PM2"]
            },
            duration: 10,
            recipe: "FS-RCA"
        },
        "Back Side Clean": {
            tool: "SCR03",
            chambers: ["SCR03-PM1"],
            duration: 10,
            recipe: "BS-RCA"
        }
    },
    "THIN-FILM": {
        "Thermal Oxide": {
            tool: "DIFF01",
            chambers: ["DIFF01-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "Nitride": {
            tool: "CVN01",
            chambers: ["CVN01-PM1"],
            duration: 10 // 10 seconds for testing
        }
    },
    "PHOTO": {
        "HMDS": {
            tool: "TRC01",
            chambers: ["TRC01-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "Coating": {
            tool: "TRC02",
            chambers: ["TRC02-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "Exposure": {
            tool: "TRC03",
            chambers: ["TRC03-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "Development": {
            tool: "TRC04",
            chambers: ["TRC04-PM1"],
            duration: 10 // 10 seconds for testing
        }
    },
    "DRY-ETCH": {
        "Poly Etch": {
            tool: "LPE04",
            chambers: ["LPE04-PM1", "LPE04-PM2"],
            duration: 10, // 10 seconds for testing
            recipe: "POLY-ETCH"
        },
        "Oxide Etch": {
            tool: "ASH01",
            chambers: ["ASH01-PM1"],
            duration: 10 // 10 seconds for testing
        }
    },
    "IMPLANT": {
        "N+ Implant": {
            tool: "IMP01",
            chambers: ["IMP01-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "P+ Implant": {
            tool: "IMP02",
            chambers: ["IMP02-PM1"],
            duration: 10 // 10 seconds for testing
        }
    },
    "DIFFUSION": {
        "RTA": {
            tool: "DIFF02",
            chambers: ["DIFF02-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "Drive-in": {
            tool: "DIFF03",
            chambers: ["DIFF03-PM1"],
            duration: 10 // 10 seconds for testing
        }
    },
    "CMP": {
        "STI CMP": {
            tool: "CMA01",
            chambers: ["CMA01-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "ILD CMP": {
            tool: "CMA02",
            chambers: ["CMA02-PM1"],
            duration: 10 // 10 seconds for testing
        }
    },
    "METROLOGY": {
        "CD-SEM": {
            tool: "MET01",
            chambers: ["MET01-PM1"],
            duration: 10 // 10 seconds for testing
        },
        "Overlay": {
            tool: "MET02",
            chambers: ["MET02-PM1"],
            duration: 10 // 10 seconds for testing
        }
    },
    "INSPECTION": {
        "Defect": {
            tool: "INS01",
            chambers: ["INS01-PM1"],
            duration: 10 // 10 seconds for testing
        }
    }
};

// Process Flow Status
let processFlowStatus = {
    currentStep: 0,
    totalSteps: Object.keys(processFlow).length,
    isProcessing: false
};

// Function to get next process step
function getNextProcessStep() {
    const steps = Object.keys(processFlow);
    if (processFlowStatus.currentStep >= steps.length) {
        return null;
    }
    return steps[processFlowStatus.currentStep];
}

// Function to update chamber status display
function updateChamberStatus(chamberElement, lotId, status, timeLeft, description) {
    const statusClass = status.toLowerCase();
    const chamberId = chamberElement.getAttribute('data-chamber-id');
    const chamberNumber = chamberId.split('-')[1].replace('PM', '');
    const wafersPerChamber = 13; // 25 wafers total, 2 chambers (13 + 12)
    
    // Calculate wafer range for this chamber
    let waferStart, waferEnd;
    if (chamberNumber === '1') {
        waferStart = 1;
        waferEnd = wafersPerChamber;
    } else {
        waferStart = wafersPerChamber + 1;
        waferEnd = 25;
    }

    // Create wafer list
    let waferList = '';
    for (let i = waferStart; i <= waferEnd; i++) {
        waferList += `<div class="wafer-item">Wafer #${i}</div>`;
    }

    // Update chamber content
    const chamberContent = chamberElement.querySelector('.chamber-content');
    chamberContent.innerHTML = `
        <div class="chamber-status" data-lot-id="${lotId}" onclick="showLotDetails('${lotId}', '${status}', '${description}')">
            <div class="lot-id">Lot: ${lotId}</div>
            <div class="status ${statusClass}">${status}</div>
            <div class="description">${description}</div>
            <div class="timer">${timeLeft}s</div>
            <div class="wafer-list">
                ${waferList}
            </div>
        </div>
    `;
    
    // Update chamber background based on status
    chamberElement.className = `chamber ${statusClass}`;
}

// Function to show lot details
function showLotDetails(lotId, status, description) {
    const lotDetailsContent = document.getElementById('lotDetailsContent');
    const wafersPerChamber = 13; // 25 wafers total, 2 chambers (13 + 12)
    
    // Get current step and tool information
    const currentStep = description.split(' - ')[0];
    const currentSubStep = description.split(' - ')[1];
    const toolConfig = processFlow[currentStep][currentSubStep];
    
    let detailsHtml = `
        <p><strong>Lot ID:</strong> ${lotId}</p>
        <p><strong>Current Step:</strong> ${currentStep}</p>
        <p><strong>Sub Step:</strong> ${currentSubStep}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Total Wafers:</strong> 25</p>
        <div class="wafer-list">
            <h4>Wafer Distribution:</h4>
            <p><strong>Chamber 1:</strong></p>
            <ul>
    `;

    // Add wafers for first chamber
    for (let i = 1; i <= wafersPerChamber; i++) {
        detailsHtml += `<li class="wafer-item">Wafer #${i}</li>`;
    }

    detailsHtml += `
            </ul>
            <p><strong>Chamber 2:</strong></p>
            <ul>
    `;

    // Add wafers for second chamber
    for (let i = wafersPerChamber + 1; i <= 25; i++) {
        detailsHtml += `<li class="wafer-item">Wafer #${i}</li>`;
    }

    detailsHtml += `
            </ul>
        </div>
    `;

    // Add recipe information if available
    if (toolConfig && toolConfig.recipe) {
        detailsHtml += `<p><strong>Recipe:</strong> ${toolConfig.recipe}</p>`;
    }

    // Add duration information
    if (toolConfig) {
        detailsHtml += `<p><strong>Process Time:</strong> ${toolConfig.duration} seconds</p>`;
    }

    lotDetailsContent.innerHTML = detailsHtml;
}

// Function to show Queue popup
function showQueuePopup(message) {
    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = 'queue-popup-container';
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'queue-popup-content';
    
    // Add message
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    popupContent.appendChild(messageElement);
    
    // Add OK button
    const okButton = document.createElement('button');
    okButton.className = 'queue-popup-button';
    okButton.textContent = 'OK';
    okButton.onclick = () => {
        document.body.removeChild(popupContainer);
    };
    popupContent.appendChild(okButton);
    
    // Add popup content to container
    popupContainer.appendChild(popupContent);
    
    // Add popup to body
    document.body.appendChild(popupContainer);
}

// Function to find an available tool for a process
function findAvailableTool(toolConfig) {
    // For Front Side Clean, just find any available SCR tool
    if (toolConfig.tools) {
        for (const toolName of toolConfig.tools) {
            const toolElement = document.querySelector(`.fab-tool[data-tool-id="${toolName}"]`);
            if (toolElement) {
                // Check if any chamber in this tool is processing
                const processingChambers = toolElement.querySelectorAll('.chamber-content .chamber-status .status.processing');
                const idleChambers = toolElement.querySelectorAll('.chamber-content .chamber-status .status.idle');
                if (processingChambers.length === 0 && idleChambers.length > 0) {
                    console.log(`Found available tool: ${toolName}`);
                    return toolElement;
                }
            }
        }
        console.log('No available tools found for Front Side Clean');
        return null;
    }
    
    // For other processes, use the dedicated tool
    const toolElement = document.querySelector(`.fab-tool[data-tool-id="${toolConfig.tool}"]`);
    if (toolElement) {
        // Check if any chamber in this tool is processing
        const processingChambers = toolElement.querySelectorAll('.chamber-content .chamber-status .status.processing');
        const idleChambers = toolElement.querySelectorAll('.chamber-content .chamber-status .status.idle');
        if (processingChambers.length === 0 && idleChambers.length > 0) {
            console.log(`Found available tool: ${toolConfig.tool}`);
            return toolElement;
        }
    }
    
    console.log('No available tools found for dedicated tool');
    return null;
}

// Function to process a lot through the flow
function processLot(lotId) {
    console.log(`Processing lot: ${lotId}`);
    
    if (processFlowStatus.isProcessing) {
        return;
    }

    processFlowStatus.isProcessing = true;
    const nextStep = getNextProcessStep();
    
    if (!nextStep) {
        console.log("Process flow completed");
        processFlowStatus.isProcessing = false;
        return;
    }

    console.log(`Next step: ${nextStep}`);
    const section = processFlow[nextStep];
    const firstSubSection = Object.keys(section)[0];
    const toolConfig = section[firstSubSection];

    // Get the first available tool
    const toolElement = document.querySelector(`.fab-tool[data-tool-id="${toolConfig.tools[0] || toolConfig.tool}"]`);
    
    if (!toolElement) {
        console.error('Tool not found');
        processFlowStatus.isProcessing = false;
        return;
    }

    console.log(`Using tool: ${toolElement.getAttribute('data-tool-id')}`);

    // Get the tool name and determine chambers
    const toolName = toolElement.getAttribute('data-tool-id');
    let chambers;
    
    // Handle Front Side Clean which has multiple tools
    if (toolConfig.tools && toolConfig.chambers && toolConfig.chambers[toolName]) {
        chambers = toolConfig.chambers[toolName];
    } else if (Array.isArray(toolConfig.chambers)) {
        chambers = toolConfig.chambers;
    } else {
        console.error('Invalid chambers configuration:', toolConfig.chambers);
        processFlowStatus.isProcessing = false;
        return;
    }

    // Ensure chambers is an array
    if (!Array.isArray(chambers)) {
        console.error('Chambers configuration is invalid:', chambers);
        processFlowStatus.isProcessing = false;
        return;
    }

    // Highlight the tool and chambers being used
    toolElement.classList.add('processing');
    
    // Update chambers with lot information and start countdown
    let timeLeft = toolConfig.duration;
    const description = `${nextStep} - ${firstSubSection}`;
    
    // Update each chamber with the lot information
    chambers.forEach(chamberId => {
        const chamberElement = toolElement.querySelector(`[data-chamber-id="${chamberId}"]`);
        if (chamberElement) {
            chamberElement.classList.add('processing');
            updateChamberStatus(chamberElement, lotId, 'Processing', timeLeft, description);
        } else {
            console.error(`Chamber ${chamberId} not found in tool ${toolName}`);
        }
    });

    // Start countdown timer
    const timer = setInterval(() => {
        timeLeft--;
        chambers.forEach(chamberId => {
            const chamberElement = toolElement.querySelector(`[data-chamber-id="${chamberId}"]`);
            if (chamberElement) {
                updateChamberStatus(chamberElement, lotId, 'Processing', timeLeft, description);
            }
        });

        if (timeLeft <= 0) {
            clearInterval(timer);
            chambers.forEach(chamberId => {
                const chamberElement = toolElement.querySelector(`[data-chamber-id="${chamberId}"]`);
                if (chamberElement) {
                    chamberElement.classList.remove('processing');
                    updateChamberStatus(chamberElement, lotId, 'Completed', 0, description);
                }
            });
            toolElement.classList.remove('processing');
            processFlowStatus.currentStep++;
            processFlowStatus.isProcessing = false;
            processLot(lotId); // Process next step
        }
    }, 1000);
}
  
  // Function to render the Chambers view in the FAB ZONE.
function renderChambersView(selectedSection = 'all') {
    const fabZone = document.getElementById('fabZone');
    fabZone.innerHTML = ''; // Clear the FAB ZONE
  
    // Create a section for each mapping entry
    for (let section in sectionMapping) {
        // Skip sections that don't match the selected section
        if (selectedSection !== 'all' && section !== selectedSection) {
            continue;
        }
  
      let sectionDiv = document.createElement('div');
      sectionDiv.className = 'fab-section';
  
      let sectionTitle = document.createElement('h4');
      sectionTitle.textContent = `Section: ${section}`;
      sectionDiv.appendChild(sectionTitle);
  
        // Create a container for the tools within the section
      let toolsContainer = document.createElement('div');
      toolsContainer.className = 'tools-container';
  
        // Handle tool creation based on section
        if (section === "WET-CLEAN") {
            // Add SCR01 and SCR02 for Front Side Clean
            for (let i = 1; i <= 2; i++) {
                let toolName = `SCR${i}`;
                let toolDiv = createToolElement(toolName, 2);
                toolsContainer.appendChild(toolDiv);
            }
            // Add SCR03 for Back Side Clean
            let toolDiv = createToolElement("SCR03", 1);
            toolsContainer.appendChild(toolDiv);
        } else if (section === "DRY-ETCH") {
            // Add LPE tools (04/05/06) for Poly Etch
            for (let i = 4; i <= 6; i++) {
                let toolName = `LPE${i}`;
                let toolDiv = createToolElement(toolName, 2);
                toolsContainer.appendChild(toolDiv);
            }
            // Add CNT tools (04/05/06) for CNT Etch
            for (let i = 4; i <= 6; i++) {
                let toolName = `CNT${i}`;
                let toolDiv = createToolElement(toolName, 2);
                toolsContainer.appendChild(toolDiv);
            }
            // Add ASH01 for Oxide Etch
            let toolDiv = createToolElement("ASH01", 1);
            toolsContainer.appendChild(toolDiv);
        } else {
            // Default tool creation for other sections
            const numTools = 2;
            for (let i = 1; i <= numTools; i++) {
        let toolNum = i < 10 ? "0" + i : i;
                let toolName = sectionMapping[section].prefix + toolNum;
                let toolDiv = createToolElement(toolName, 1);
        toolsContainer.appendChild(toolDiv);
      }
        }
  
      sectionDiv.appendChild(toolsContainer);
      fabZone.appendChild(sectionDiv);
    }
  }
  
// Helper function to create a tool element
function createToolElement(toolName, numChambers) {
    let toolDiv = document.createElement('div');
    toolDiv.className = 'fab-tool';
    toolDiv.setAttribute('data-tool-id', toolName);
    
    // Create tool header
    let toolHeader = document.createElement('div');
    toolHeader.className = 'tool-header';
    toolHeader.textContent = `Tool: ${toolName}`;
    toolDiv.appendChild(toolHeader);

    // Create chambers container
    let chambersContainer = document.createElement('div');
    chambersContainer.className = 'chambers-container';

    // Add chambers
    for (let j = 1; j <= numChambers; j++) {
        let chamberDiv = document.createElement('div');
        chamberDiv.className = 'chamber';
        let chamberId = `${toolName}-PM${j}`;
        
        // Create chamber header
        let chamberHeader = document.createElement('div');
        chamberHeader.className = 'chamber-header';
        chamberHeader.textContent = `Chamber ${j} (${chamberId})`;
        chamberDiv.appendChild(chamberHeader);
        
        // Create chamber content container
        let chamberContent = document.createElement('div');
        chamberContent.className = 'chamber-content';
        chamberContent.setAttribute('data-chamber-id', chamberId);
        chamberContent.innerHTML = `
            <div class="chamber-status">
                <div class="lot-id">No Lot</div>
                <div class="status idle">Idle</div>
                <div class="description">Waiting for lot...</div>
                <div class="timer">--</div>
                <div class="wafer-list"></div>
            </div>
        `;
        chamberDiv.appendChild(chamberContent);
        
        chambersContainer.appendChild(chamberDiv);
    }

    toolDiv.appendChild(chambersContainer);
    return toolDiv;
  }
  
  // Event listener for the "Start Material" button.
  document.getElementById('startMaterialBtn').addEventListener('click', () => {
    fetch('/create_lot', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        console.log("Received data from /create_lot:", data);
            
            if (data.error) {
                console.error('Error creating lot:', data.error);
                return;
            }
  
        // Create a lot item for the left sidebar (STOCKER).
        let stockerPanel = document.getElementById('stocker');
        let lotItem = document.createElement('div');
        lotItem.className = 'lot-item';
  
            // Create a container for lot information
            let lotInfo = document.createElement('div');
            lotInfo.className = 'lot-info';
    
            // Display the lot ID
        let lotText = document.createElement('span');
        lotText.textContent = data.lot_id;
            lotInfo.appendChild(lotText);
    
            // Add next step preview
            let nextStep = document.createElement('div');
            nextStep.className = 'next-step-preview';
            const firstStep = Object.keys(processFlow)[0];
            const firstSubStep = Object.keys(processFlow[firstStep])[0];
            nextStep.textContent = `Next: ${firstStep} - ${firstSubStep}`;
            lotInfo.appendChild(nextStep);
    
            lotItem.appendChild(lotInfo);
    
            // Create the "Track-In" button
        let trackInBtn = document.createElement('button');
        trackInBtn.textContent = 'Track-In';
        trackInBtn.className = 'track-in-btn';
  
            // Add event listener for "Track-In"
            trackInBtn.addEventListener('click', () => {
          console.log(`Track-In clicked for lot: ${data.lot_id}`);
                
                // Get the first available tool and chamber
                const firstStep = Object.keys(processFlow)[0];
                const firstSubStep = Object.keys(processFlow[firstStep])[0];
                const toolConfig = processFlow[firstStep][firstSubStep];
                
                // Get the first tool from the configuration
                const toolId = toolConfig.tools ? toolConfig.tools[0] : toolConfig.tool;
                const toolElement = document.querySelector(`.fab-tool[data-tool-id="${toolId}"]`);
                
                if (toolElement) {
                    // Get all chambers in the tool
                    const chambers = toolElement.querySelectorAll('.chamber-content');
                    if (chambers.length > 0) {
                        // Update each chamber with the lot information
                        chambers.forEach(chamberElement => {
                            const description = `${firstStep} - ${firstSubStep}`;
                            updateChamberStatus(chamberElement, data.lot_id, 'Processing', toolConfig.duration, description);
                            
                            // Update chamber background color
                            chamberElement.parentElement.classList.add('processing');
                        });
                        
                        // Update tool background color
                        toolElement.classList.add('processing');
                        
                        // Update lot status in the database
                        fetch(`/update_lot_status/${data.lot_id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                status: 'processing',
                                current_step: `${firstStep} - ${firstSubStep}`
                            })
                        });
                        
                        // Start the process flow
                        processFlowStatus = {
                            currentStep: 0,
                            totalSteps: Object.keys(processFlow).length,
                            isProcessing: false
                        };
                        
                        // Process the lot
                        processLot(data.lot_id);
                    }
                }
            });
  
            lotItem.appendChild(trackInBtn);
  
            // Append the new lot item to the left sidebar
            stockerPanel.appendChild(lotItem);
        })
        .catch(error => console.error('Error:', error));
    });

// Event listener for section grouping dropdown
document.getElementById('sectionGroupSelect').addEventListener('change', (event) => {
    renderChambersView(event.target.value);
});

// Initialize the FAB ZONE with chambers view when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderChambersView();
});