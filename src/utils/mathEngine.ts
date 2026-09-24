import { AngleMode } from '../types';

export function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (!Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // JS Number max
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

export function cleanFloat(num: number): number {
  if (Number.isNaN(num) || !Number.isFinite(num)) return num;
  // Fix precision issues e.g. 0.1 + 0.2
  return parseFloat(num.toPrecision(12));
}

export function formatNumber(val: number | string): string {
  if (typeof val === 'string') {
    const num = Number(val);
    if (isNaN(num)) return val;
    val = num;
  }
  if (Number.isNaN(val)) return 'Error';
  if (!Number.isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';

  const absVal = Math.abs(val);
  if ((absVal > 0 && absVal < 1e-7) || absVal >= 1e15) {
    return val.toExponential(6).replace('e+', 'e');
  }

  const parts = val.toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}

export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): { result: number; formatted: string } {
  try {
    if (!expr || expr.trim() === '') {
      return { result: 0, formatted: '0' };
    }

    // Replace visual symbols
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/\be\b/g, `(${Math.E})`);

    // Handle percentage: e.g. 50% -> (50*0.01)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1*0.01)');

    // Handle factorial e.g. 5! -> fact(5)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)!/g, 'fact($1)');

    // Tokenizer / Parser using recursive shunting-yard or AST
    const tokens = tokenize(sanitized);
    const rpn = toRPN(tokens);
    const res = evaluateRPN(rpn, angleMode);

    const cleaned = cleanFloat(res);
    return {
      result: cleaned,
      formatted: formatNumber(cleaned),
    };
  } catch {
    return { result: NaN, formatted: 'Error' };
  }
}

// Token types
type TokenType = 'NUMBER' | 'OP' | 'FUNC' | 'LPAREN' | 'RPAREN' | 'COMMA';
interface Token {
  type: TokenType;
  value: string;
}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'sqrt', 'cbrt', 'log', 'ln', 'abs', 'fact', 'exp'
]);

const OPERATORS: Record<string, { precedence: number; assoc: 'L' | 'R' }> = {
  '+': { precedence: 2, assoc: 'L' },
  '-': { precedence: 2, assoc: 'L' },
  '*': { precedence: 3, assoc: 'L' },
  '/': { precedence: 3, assoc: 'L' },
  '%': { precedence: 3, assoc: 'L' },
  '^': { precedence: 4, assoc: 'R' },
  'u-': { precedence: 5, assoc: 'R' }, // unary minus
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Number (or decimal)
    if (/\d/.test(char) || (char === '.' && i + 1 < input.length && /\d/.test(input[i + 1]))) {
      let numStr = '';
      while (i < input.length && (/[\d.]/.test(input[i]) || (input[i].toLowerCase() === 'e' && /[\d+-]/.test(input[i+1] || '')))) {
        if (input[i].toLowerCase() === 'e') {
          numStr += input[i];
          i++;
          if (input[i] === '+' || input[i] === '-') {
            numStr += input[i];
            i++;
          }
        } else {
          numStr += input[i];
          i++;
        }
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Identifiers (function names)
    if (/[a-zA-Z]/.test(char)) {
      let ident = '';
      while (i < input.length && /[a-zA-Z0-9]/.test(input[i])) {
        ident += input[i];
        i++;
      }
      if (FUNCTIONS.has(ident)) {
        tokens.push({ type: 'FUNC', value: ident });
      } else {
        throw new Error(`Unknown function: ${ident}`);
      }
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    // Operators
    if (['+', '-', '*', '/', '%', '^'].includes(char)) {
      // Check for unary minus
      const prev = tokens[tokens.length - 1];
      if (char === '-' && (!prev || prev.type === 'OP' || prev.type === 'LPAREN' || prev.type === 'COMMA')) {
        tokens.push({ type: 'OP', value: 'u-' });
      } else {
        tokens.push({ type: 'OP', value: char });
      }
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}

function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const opStack: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER') {
      output.push(token);
    } else if (token.type === 'FUNC') {
      opStack.push(token);
    } else if (token.type === 'OP') {
      const o1 = token.value;
      const op1 = OPERATORS[o1];

      while (opStack.length > 0) {
        const top = opStack[opStack.length - 1];
        if (top.type === 'OP') {
          const o2 = top.value;
          const op2 = OPERATORS[o2];
          if (
            (op1.assoc === 'L' && op1.precedence <= op2.precedence) ||
            (op1.assoc === 'R' && op1.precedence < op2.precedence)
          ) {
            output.push(opStack.pop()!);
          } else {
            break;
          }
        } else {
          break;
        }
      }
      opStack.push(token);
    } else if (token.type === 'LPAREN') {
      opStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'LPAREN') {
        output.push(opStack.pop()!);
      }
      if (opStack.length === 0) {
        throw new Error('Mismatched parentheses');
      }
      opStack.pop(); // remove '('
      if (opStack.length > 0 && opStack[opStack.length - 1].type === 'FUNC') {
        output.push(opStack.pop()!);
      }
    }
  }

  while (opStack.length > 0) {
    const op = opStack.pop()!;
    if (op.type === 'LPAREN' || op.type === 'RPAREN') {
      throw new Error('Mismatched parentheses');
    }
    output.push(op);
  }

  return output;
}

function evaluateRPN(rpn: Token[], angleMode: AngleMode): number {
  const stack: number[] = [];

  const toRad = (x: number) => (angleMode === 'DEG' ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (angleMode === 'DEG' ? (x * 180) / Math.PI : x);

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'OP') {
      if (token.value === 'u-') {
        const a = stack.pop();
        if (a === undefined) throw new Error('Invalid syntax');
        stack.push(-a);
        continue;
      }

      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new Error('Invalid syntax');

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
        case '%':
          stack.push(a % b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator ${token.value}`);
      }
    } else if (token.type === 'FUNC') {
      const a = stack.pop();
      if (a === undefined) throw new Error('Invalid syntax');

      switch (token.value) {
        case 'sin':
          stack.push(Math.sin(toRad(a)));
          break;
        case 'cos':
          stack.push(Math.cos(toRad(a)));
          break;
        case 'tan': {
          const cosVal = Math.cos(toRad(a));
          if (Math.abs(cosVal) < 1e-15) throw new Error('Undefined');
          stack.push(Math.tan(toRad(a)));
          break;
        }
        case 'asin':
          stack.push(fromRad(Math.asin(a)));
          break;
        case 'acos':
          stack.push(fromRad(Math.acos(a)));
          break;
        case 'atan':
          stack.push(fromRad(Math.atan(a)));
          break;
        case 'sinh':
          stack.push(Math.sinh(a));
          break;
        case 'cosh':
          stack.push(Math.cosh(a));
          break;
        case 'tanh':
          stack.push(Math.tanh(a));
          break;
        case 'sqrt':
          if (a < 0) throw new Error('Invalid input');
          stack.push(Math.sqrt(a));
          break;
        case 'cbrt':
          stack.push(Math.cbrt(a));
          break;
        case 'log':
          if (a <= 0) throw new Error('Invalid input');
          stack.push(Math.log10(a));
          break;
        case 'ln':
          if (a <= 0) throw new Error('Invalid input');
          stack.push(Math.log(a));
          break;
        case 'abs':
          stack.push(Math.abs(a));
          break;
        case 'fact':
          stack.push(factorial(a));
          break;
        case 'exp':
          stack.push(Math.exp(a));
          break;
        default:
          throw new Error(`Unknown function: ${token.value}`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}
