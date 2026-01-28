document.addEventListener('DOMContentLoaded', setup);

import {MiniMaple} from "./miniMaple.js";

function setup() {
    const calculateButton = document.getElementById('demoButton');
    calculateButton.addEventListener('click', handleCalculation);
}

function handleCalculation() {
    const expression = document.getElementById('diff').value.trim();
    const variable = document.getElementById('var').value.trim();
    if (!validateInput(expression, variable)) {
        return;
    }
    const differentiator = new MiniMaple();
    displayResult(expression, variable, differentiator.calculateDerivative(expression, variable));
}

function validateInput(expression, variable) {
    if (!expression) {
        alert('Please enter an expression');
        return false;
    }
    if (!variable || variable.length !== 1) {
        alert('Please enter a single variable');
        return false;
    }
    return true;
}

function displayResult(expression, variable, derivative) {
    const resultsContainer = document.getElementById('container');
    const resultElement = createResultElement(expression, variable, derivative);
    resultsContainer.appendChild(resultElement);
}

function createResultElement(expression, variable, derivative) {
    const resultDiv = document.createElement('div');
   
    resultDiv.className = 'result-item generated'; 
    resultDiv.innerHTML = `
        <div class="calculation">
            <span class="expression">d(${expression})/d${variable} =</span>
            <span class="derivative">${derivative}</span>
        </div>
    `;
    
    return resultDiv;
}