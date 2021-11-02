import _ from 'lodash';

const calculateRotationData = (statuses, fromItem, toItem, rotateCount, oneRotateTime, rotateOnDegrees) => {
  // calculate angles
  const itemsCount = statuses.length;
  const angleByStep = 360 / itemsCount;

  // calculate steps
  const stepsBeforeStop = itemsCount * rotateCount;
  let steps;
  if (fromItem > toItem) {
    steps = itemsCount - (fromItem - toItem);
  } else {
    steps = toItem - fromItem;
  }
  const sumOfSteps = steps + stepsBeforeStop;

  // calculate time
  const rotateTimeByStep = oneRotateTime / itemsCount;
  const rotateTime = rotateTimeByStep * sumOfSteps;

  return {
    rotateOnDegrees: rotateOnDegrees - (sumOfSteps * angleByStep),
    rotateTime,
  };
};

const getNextItem = (currentItem) => {
  let nextItem;
  do {
    nextItem = _.random(1, 12);
  } while (nextItem === currentItem);
  return nextItem;
};

const app = (state) => {
  const { statuses, currentItem } = state.roulette;
  const nextItem = getNextItem(currentItem);

  const rotationData = calculateRotationData(statuses, currentItem, nextItem, state.roulette.rotateCount, state.roulette.oneRotateTime, state.roulette.rotateOnDegrees);
  state.roulette = { ...state.roulette, ...rotationData, currentItem: nextItem };
  state.userData.currentStatus = state.roulette.statuses[nextItem - 1];
};

export default app;
