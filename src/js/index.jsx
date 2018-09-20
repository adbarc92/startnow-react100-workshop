import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
  var squareStyle = { backgroundColor: 'white' }
  if( props.winner ){
    squareStyle = { backgroundColor: 'yellow' }
  }
  return (
    <button className="square" style={squareStyle} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function getSquare( movePosition ){
  if( movePosition.yPos === 1 ){
    if( movePosition.xPos === 1 ){
      return 0;
    }
    if( movePosition.xPos === 2 ){
      return 1;
    }
    if( movePosition.xPos === 3 ){
      return 2;
    }
  }
  else if( movePosition.yPos === 2 ){
    if( movePosition.xPos === 1 ){
      return 3;
    }
    if( movePosition.xPos === 2 ){
      return 4;
    }
    if( movePosition.xPos === 3 ){
      return 5;
    }
  }
  else if( movePosition.yPos === 3 ){
    if( movePosition.xPos === 1 ){
      return 6;
    }
    if( movePosition.xPos === 2 ){
      return 7;
    }
    if( movePosition.xPos === 3 ){
      return 8;
    }
  }
  else return null;
}

function getCoordinates( i ){ // Addition
  var ret = {
    xPos: 0,
    yPos: 0
  };
  if     ( i === 0 ){
    ret.xPos = 1;
    ret.yPos = 1;
  } // (1,1)
  else if( i === 1 ){
    ret.xPos = 2;
    ret.yPos = 1;
  } // (2,1)
  else if( i === 2 ){
    ret.xPos = 3;
    ret.yPos = 1;
  } // (3,1)
  else if( i === 3 ){
    ret.xPos = 1;
    ret.yPos = 2;
  } // (1,2)
  else if( i === 4 ){
    ret.xPos = 2;
    ret.yPos = 2;
  } // (2,2)
  else if( i === 5 ){
    ret.xPos = 3;
    ret.yPos = 2;
  } // (3,2)
  else if( i === 6 ){
    ret.xPos = 1;
    ret.yPos = 3;
  } // (1,3)
  else if( i === 7 ){
    ret.xPos = 2;
    ret.yPos = 3;
  } // (2,3)
  else if( i === 8 ){
    ret.xPos = 3;
    ret.yPos = 3;
  } // (3,3)
  return ret;
}

function displayCoords( movePosition ){
  console.log( 'movePosition:', movePosition );
  var str = `(${movePosition.xPos} , ${movePosition.yPos})`;
  console.log(str);
  return '(' + movePosition.xPos + ',' + movePosition.yPos + ')'
}

class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square
        value={this.props.squares[i]}
        onClick= {() => this.props.onClick(i)}
        winner={this.props.winnerSquares.includes(i) ? true : false}
      />
    );
  }
  renderBoard( rows ) {
    let board = [];
    for( let i = 1; i < rows + 1; i++ ){
      let children = [];
      for( let j = 1; j < rows + 1; j++ ){
        children.push( this.renderSquare( getSquare( {
          xPos: i,
          yPos: j
        } ) ) )
      }
      board.push( <div className="board-row">{children}</div> );
    }
    return board;
  }
  render() {
    return(
      <div>{this.renderBoard(3)}</div> // Map Instead
      )
      // <div>
      //   <div className="board-row">
      //     {this.renderSquare(0)}
      //     {this.renderSquare(1)}
      //     {this.renderSquare(2)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(3)}
      //     {this.renderSquare(4)}
      //     {this.renderSquare(5)}
      //   </div>
      //   <div className="board-row">
      //     {this.renderSquare(6)}
      //     {this.renderSquare(7)}
      //     {this.renderSquare(8)}
      //   </div>
      // </div>
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movePosition: [{
          xPos: 0,
          yPos: 0,
          stepNumber: 0,
        }],
      }],
      ordering: false,
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleButton(){
    this.setState({
      ordering: !(this.state.ordering),
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    var pos = getCoordinates(i);
    var position = { // Addition
      xPos: pos.xPos,
      yPos: pos.yPos,
      stepNumber: this.state.stepNumber + 1
    }
    console.log( 'History:', history );
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        movePosition: position
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const ordering = this.state.ordering;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const winnerSquares = findWinningLine(current.squares);

    let moves = history.map((step, move) => {
        const desc = move ?
        'Move #' + move + ': ' +  displayCoords(step.movePosition): // Addition
        'Game start';
        if( move === this.state.stepNumber ){
          return (
            <li key={move}>
            <strong><a href="#" onClick={() => this.jumpTo(move) }>{desc} </a></strong>
            </li> )
          }
          else {
            return (
              <li key={move}>
              <a href="#" onClick={() => this.jumpTo(move) }>{desc} </a>
              </li> )
            }
    });
      if( ordering === true ){
        moves = moves.reverse();
      }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerSquares={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={ () => this.handleButton() }>Press Me</button>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

  function findWinningLine(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return [];
  }

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
