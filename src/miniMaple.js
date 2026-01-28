class Term {
    constructor(coefficient = 1, variable = '', power = 0) {
        this.coefficient = coefficient;
        this.variable = variable;
        this.power = power;
    }

    static parseFromString(termStr, sign, diffVariable) {
        // Если терм является константой
        if (!termStr.includes(diffVariable)) {
            const coefficient = Term.parseCoefficient(termStr);
            const signedCoefficient = sign === '-' ? -coefficient : coefficient;
            return new Term(signedCoefficient, '', 0);
        }

        const parts = termStr.split(diffVariable);
        const coefficientPart = parts[0] || '';
        const powerPart = parts.slice(1).join(diffVariable);

        const coefficient = Term.parseCoefficient(coefficientPart);
        const power = Term.parsePower(powerPart);
        
        const signedCoefficient = sign === '-' ? -coefficient : coefficient;
        return new Term(signedCoefficient, diffVariable, power);
    }

    static parseCoefficient(coefficientStr) {
        if (!coefficientStr) return 1;
        if (coefficientStr === '-') return -1;
        if (coefficientStr === '+') return 1;
        
        const coefficient = parseFloat(coefficientStr.replace('*', ''));
        return isNaN(coefficient) ? 1 : coefficient;
    }

    static parsePower(powerStr) {
        if (!powerStr) return 1;
        if (!powerStr.startsWith('^')) return 1;
        
        const power = parseFloat(powerStr.substring(1));
        return isNaN(power) ? 1 : power;
    }

    differentiate(diffVariable) {
        // Если терм не содржит переменную дифференцирования, то производная 0
        if (this.variable !== diffVariable || this.power === 0) {
            return null;
        }

        const newCoefficient = this.coefficient * this.power;
        const newPower = this.power - 1;

        if (newCoefficient === 0) {
            return null;
        }

        return new Term(newCoefficient, this.variable, newPower);
    }

    toString() {
        if (this.power === 0) {
            return this.coefficient.toString();
        }

        let termStr = '';
        
        // Форматирование коэффициента
        if (this.coefficient !== 1 && this.coefficient !== -1) {
            termStr += this.coefficient;
        } else if (this.coefficient === -1) {
            termStr += '-';
        }
        
        // Добавление переменной и знака умножения при необходимости
        if (this.power > 0) {
            if (termStr && termStr !== '-') {
                termStr += '*';
            }
            termStr += this.variable;
        }
        
        // Добавление степени
        if (this.power > 1) {
            termStr += `^${this.power}`;
        }
        
        return termStr;
    }
}

class MiniMaple {
    calculateDerivative(expression, variable) {
        const normExpr = expression.replace(/\s+/g, '');
        const terms = this.parseTerms(normExpr, variable);
        
        const derivTerms = terms.map(term => term.differentiate(variable))
                              .filter(term => term !== null);
        
        return this.getResult(derivTerms);
    }

    parseTerms(expression, diffVariable) {
        if (!expression) return [];
        
        const terms = [];
        let currentTerm = '';
        let sign = '+';
        
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            
            if ((char === '+' || char === '-') && currentTerm !== '') {
                terms.push(Term.parseFromString(currentTerm, sign, diffVariable));
                currentTerm = '';
                sign = char;
            } else if (i === 0 && (char === '+' || char === '-')) {
                sign = char;
            } else {
                currentTerm += char;
            }
        }
        
        if (currentTerm) {
            terms.push(Term.parseFromString(currentTerm, sign, diffVariable));
        }
        
        return terms;
    }

    getResult(terms) {
        if (terms.length === 0) return '0';
        
        let result = '';
        terms.forEach((term, index) => {
            const termStr = term.toString();
            if (index === 0) {
                result += termStr;
            } else {
                result += term.coefficient > 0 ? `+${termStr}` : termStr;
            }
        });
        
        return result;
    }
}

export { MiniMaple, Term };