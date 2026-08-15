import { useState, useEffect, useCallback } from 'react'
import { 
  Calculator, 
  History, 
  Trash2, 
  Sun, 
  Moon, 
  Zap, 
  Delete, 
  RotateCcw,
  Sliders
} from 'lucide-react'

function App() {
  const [display, setDisplay] = useState('0')
  const [subDisplay, setSubDisplay] = useState('')
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [mode, setMode] = useState('standard') // 'standard' | 'scientific'
  const [theme, setTheme] = useState('dark') // 'dark' | 'cyberpunk' | 'light'
  const [isEvaluated, setIsEvaluated] = useState(false)

  // Sync theme attribute to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Handle Number Input
  const handleNumber = useCallback((num) => {
    if (isEvaluated) {
      setDisplay(num)
      setSubDisplay('')
      setIsEvaluated(false)
    } else {
      setDisplay(prev => (prev === '0' ? num : prev + num))
    }
  }, [isEvaluated])

  // Handle Operator Input
  const handleOperator = useCallback((op) => {
    setIsEvaluated(false)
    if (display === 'Error') {
      setDisplay('0')
      setSubDisplay(op)
      return
    }

    const lastChar = display.slice(-1)
    if (['+', '-', '*', '/', '%', '^'].includes(lastChar)) {
      setDisplay(display.slice(0, -1) + op)
    } else {
      setDisplay(prev => prev + op)
    }
  }, [display])

  // Clear Display
  const handleClear = useCallback(() => {
    setDisplay('0')
    setSubDisplay('')
    setIsEvaluated(false)
  }, [])

  // Backspace / Delete last character
  const handleDelete = useCallback(() => {
    if (isEvaluated) {
      handleClear()
      return
    }
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
  }, [isEvaluated, handleClear])

  // Calculate Result
  const handleEvaluate = useCallback(() => {
    try {
      if (!display || display === 'Error') return

      let sanitized = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/\^/g, '**')

      // Handle scientific functions prefixing
      sanitized = sanitized
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(')

      // Check for standalone square root
      if (sanitized.includes('√')) {
        sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)')
      }

      // Safe JS evaluation
      const evalFunc = new Function(`return ${sanitized}`)
      const result = evalFunc()

      if (result === undefined || isNaN(result) || !isFinite(result)) {
        setDisplay('Error')
        setSubDisplay(`${display} =`)
      } else {
        const formattedResult = Number(result.toFixed(8)).toString()
        setSubDisplay(`${display} =`)
        setDisplay(formattedResult)
        setHistory(prev => [{ expression: display, result: formattedResult }, ...prev.slice(0, 20)])
        setIsEvaluated(true)
      }
    } catch (err) {
      setDisplay('Error')
      setSubDisplay(`${display} =`)
    }
  }, [display])

  // Handle Scientific Functions
  const handleScientificFunc = (funcName) => {
    if (funcName === 'sqrt') {
      setDisplay(prev => (prev === '0' || isEvaluated ? '√(' : prev + '√('))
    } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(funcName)) {
      setDisplay(prev => (prev === '0' || isEvaluated ? `${funcName}(` : prev + `${funcName}(`))
    } else if (funcName === 'square') {
      setDisplay(prev => `(${prev})^2`)
    } else if (funcName === 'pi') {
      setDisplay(prev => (prev === '0' || isEvaluated ? 'π' : prev + 'π'))
    } else if (funcName === 'e') {
      setDisplay(prev => (prev === '0' || isEvaluated ? 'e' : prev + 'e'))
    }
    setIsEvaluated(false)
  }

  // Memory Functions
  const handleMemory = (action) => {
    const currentVal = parseFloat(display) || 0
    switch (action) {
      case 'MC':
        setMemory(0)
        break
      case 'MR':
        setDisplay(memory.toString())
        setIsEvaluated(true)
        break
      case 'M+':
        setMemory(prev => prev + currentVal)
        break
      case 'M-':
        setMemory(prev => prev - currentVal)
        break
      default:
        break
    }
  }

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.key >= '0' && e.key <= '9') handleNumber(e.key)
      else if (e.key === '.') handleNumber('.')
      else if (e.key === '+') handleOperator('+')
      else if (e.key === '-') handleOperator('-')
      else if (e.key === '*') handleOperator('*')
      else if (e.key === '/') handleOperator('/')
      else if (e.key === '%') handleOperator('%')
      else if (e.key === '^') handleOperator('^')
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        handleEvaluate()
      } else if (e.key === 'Backspace') handleDelete()
      else if (e.key === 'Escape') handleClear()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNumber, handleOperator, handleEvaluate, handleDelete, handleClear])

  return (
    <div className={`calc-wrapper ${showHistory ? 'with-history' : ''}`}>
      {/* Main Calculator Box */}
      <div className="calc-container">
        {/* Header Bar */}
        <div className="header">
          <div className="brand">
            <Calculator className="brand-icon" />
            <span>Mini Calc</span>
          </div>

          <div className="controls-group">
            {/* Theme Selector */}
            <button 
              className="icon-btn" 
              onClick={() => setTheme(t => t === 'dark' ? 'cyberpunk' : t === 'cyberpunk' ? 'light' : 'dark')}
              title={`Switch Theme (Current: ${theme})`}
            >
              {theme === 'dark' && <Moon size={18} />}
              {theme === 'cyberpunk' && <Zap size={18} />}
              {theme === 'light' && <Sun size={18} />}
            </button>

            {/* History Toggle */}
            <button 
              className={`icon-btn ${showHistory ? 'active' : ''}`}
              onClick={() => setShowHistory(prev => !prev)}
              title="Toggle History"
            >
              <History size={18} />
            </button>
          </div>
        </div>

        {/* Display Panel */}
        <div className="display-panel">
          {memory !== 0 && (
            <div className="memory-indicator">M ({memory})</div>
          )}
          <div className="sub-display">{subDisplay}</div>
          <div className="main-display">{display}</div>
        </div>

        {/* Mode Toggle (Standard vs Scientific) */}
        <div className="mode-toggle-bar">
          <button 
            className={`mode-btn ${mode === 'standard' ? 'active' : ''}`}
            onClick={() => setMode('standard')}
          >
            Standard
          </button>
          <button 
            className={`mode-btn ${mode === 'scientific' ? 'active' : ''}`}
            onClick={() => setMode('scientific')}
          >
            Scientific
          </button>
        </div>

        {/* Keypad */}
        <div className={`keypad ${mode}`}>
          {/* Memory Row */}
          <button className="calc-btn sm-text func" onClick={() => handleMemory('MC')}>MC</button>
          <button className="calc-btn sm-text func" onClick={() => handleMemory('MR')}>MR</button>
          <button className="calc-btn sm-text func" onClick={() => handleMemory('M+')}>M+</button>
          <button className="calc-btn sm-text func" onClick={() => handleMemory('M-')}>M-</button>
          {mode === 'scientific' && (
            <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('pi')}>π</button>
          )}

          {/* Function / Scientific Row */}
          <button className="calc-btn func" onClick={handleClear}>C</button>
          <button className="calc-btn func" onClick={handleDelete}><Delete size={18} /></button>
          <button className="calc-btn operator" onClick={() => handleOperator('%')}>%</button>
          <button className="calc-btn operator" onClick={() => handleOperator('/')}>÷</button>
          {mode === 'scientific' && (
            <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('e')}>e</button>
          )}

          {/* Scientific Row 2 (if active) */}
          {mode === 'scientific' && (
            <>
              <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('sin')}>sin</button>
              <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('cos')}>cos</button>
              <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('tan')}>tan</button>
              <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('log')}>log</button>
              <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('ln')}>ln</button>
            </>
          )}

          {/* Row 1 */}
          <button className="calc-btn" onClick={() => handleNumber('7')}>7</button>
          <button className="calc-btn" onClick={() => handleNumber('8')}>8</button>
          <button className="calc-btn" onClick={() => handleNumber('9')}>9</button>
          <button className="calc-btn operator" onClick={() => handleOperator('*')}>×</button>
          {mode === 'scientific' && (
            <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('sqrt')}>√</button>
          )}

          {/* Row 2 */}
          <button className="calc-btn" onClick={() => handleNumber('4')}>4</button>
          <button className="calc-btn" onClick={() => handleNumber('5')}>5</button>
          <button className="calc-btn" onClick={() => handleNumber('6')}>6</button>
          <button className="calc-btn operator" onClick={() => handleOperator('-')}>-</button>
          {mode === 'scientific' && (
            <button className="calc-btn sm-text func" onClick={() => handleScientificFunc('square')}>x²</button>
          )}

          {/* Row 3 */}
          <button className="calc-btn" onClick={() => handleNumber('1')}>1</button>
          <button className="calc-btn" onClick={() => handleNumber('2')}>2</button>
          <button className="calc-btn" onClick={() => handleNumber('3')}>3</button>
          <button className="calc-btn operator" onClick={() => handleOperator('+')}>+</button>
          {mode === 'scientific' && (
            <button className="calc-btn operator" onClick={() => handleOperator('^')}>^</button>
          )}

          {/* Row 4 */}
          <button className="calc-btn span-2" onClick={() => handleNumber('0')}>0</button>
          <button className="calc-btn" onClick={() => handleNumber('.')}>.</button>
          <button className="calc-btn equals" onClick={handleEvaluate}>=</button>
          {mode === 'scientific' && (
            <button className="calc-btn sm-text" onClick={() => handleNumber('(')}>(</button>
          )}
        </div>
      </div>

      {/* History Side Panel */}
      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <div className="history-title">
              <History size={20} />
              <span>History</span>
            </div>
            {history.length > 0 && (
              <button 
                className="icon-btn" 
                onClick={() => setHistory([])}
                title="Clear History"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty-history">
              <RotateCcw size={32} opacity={0.5} />
              <p>No calculation history yet</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className="history-item"
                  onClick={() => {
                    setDisplay(item.result)
                    setSubDisplay(`${item.expression} =`)
                    setIsEvaluated(true)
                  }}
                >
                  <span className="history-expression">{item.expression} =</span>
                  <span className="history-result">{item.result}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
