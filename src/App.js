import "./App.css";
//downloaded this package so that I am able to use CSS within my React project
import styled from "styled-components";
import { useEffect, useState } from "react";

const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;

function App() {
  //useState will be used to keep track of the bird position at all time
  const [birdPosition, setBirdPosition] = useState(250);
  //useState used to allow user to start the game with they are ready without bird moving abruptly
  const [gameHasStarted, setGameHasStarted] = useState(false);
  //useState used to control obstacle height and left positioning
  const [obstacleHeight, setobstacleHeight] = useState(100);
  const [obstacleLeft, setobstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  //useState used to keep track of the user score
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  //useEffect used so the bird can fall down at a continuous rate
  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [birdPosition, gameHasStarted]);

  //useEffect used to update the obstacles path from the right side of the screen to the left and make obstacles scroll constantly
  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setobstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      };
    } else {
      //generate a new obstacle with a new random height
      setobstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setobstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      setScore((score) => score + 1);
    }
  }, [gameHasStarted, obstacleLeft]);

  //useEffect use for collison detection. To check if the bird has collided with the top or bottom obstacles
  useEffect(() => {
    const hasCollideWithTopObstacle =
      birdPosition >= 0 && birdPosition < obstacleHeight;
    const hadColllideWithBottomObstacle =
      birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;

    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollideWithTopObstacle || hadColllideWithBottomObstacle)
    ) {
      setGameHasStarted(false);
    }
  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  //function created to enable the bird to jump up
  const handleClick = () => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (!gameHasStarted) {
      setGameHasStarted(true);
      setScore(0);
      setBirdPosition(250);
    } else if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };

  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        //Created two obstacle components to represent the top and bottom
        obstacles
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPosition} />
      </GameBox>
      //display our users score
      <span> {score} </span>
    </Div>
  );
}

export default App;

//Bird object
const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

//create the box that will contain the game
const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;
