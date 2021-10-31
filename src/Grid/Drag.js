import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

export const Drag = ({ ...props }) => {
  const [el, setEl] = useState(['first']);
  const [grid, setGrid] = useState([]);
  useEffect(() => {
    let yPos = 0;
    grid.forEach((gridEl) => {
      if (gridEl.endY > yPos) {
        yPos = gridEl.endY + 10;
      }
    });
    setGrid([...grid, { id: el[el.length - 1], startX: 0, startY: yPos, width: 0, height: 200, endX: 0, endY: yPos + 200 }]);
  }, [el.length]);

  const onStart = () => {};

  const onStop = (e, position, id) => {
    const { x, y } = position;
    const activeGridItem = {
      startX: x,
      startY: y,
      endX: x + position.node.offsetWidth,
      endY: y + position.node.offsetHeight,
      width: position.node.offsetWidth,
      height: position.node.offsetHeight,
    };
    const gridItems = grid.map((g) => (g.id === id ? { ...g, ...activeGridItem } : g));
    const gridItemsToTop = identifyElementsThatNeedToTranslateToTop(gridItems);

    setGrid(gridItemsToTop);
  };

  const onControlledDrag = (e, position, id) => {
    const { x, y } = position;

    const activeGridItem = {
      id,
      startX: x,
      startY: y,
      endX: x + position.node.offsetWidth,
      endY: y + position.node.offsetHeight,
      width: position.node.offsetWidth,
      height: position.node.offsetHeight,
    };
    const gridItems = grid.map((g) => (g.id === id ? { ...g, ...activeGridItem } : g));

    const elementsThatNeedToChangeYPosition = identifyElementsThatNeedToTranslateToBottom(gridItems, activeGridItem);
    const gridItemsWithChangedYPosition = changeGridElementsYPosition(gridItems, elementsThatNeedToChangeYPosition, activeGridItem.height);
    console.log('Bot');
    console.log(gridItemsWithChangedYPosition);
    const gridItemsToTop = identifyElementsThatNeedToTranslateToTop(gridItemsWithChangedYPosition, activeGridItem);
    console.log('TOP');
    console.log(gridItemsToTop);

    setGrid(gridItemsToTop);
  };

  const identifyElementsThatNeedToTranslateToTop = (grid, activeGridItem) => {
    let isChanges = false;
    let gridCopy = JSON.parse(JSON.stringify(grid));
    do {
      isChanges = false;
      gridCopy = JSON.parse(JSON.stringify(gridCopy))
        .sort((a, b) => a.startY - b.startY)
        //eslint-disable-next-line
        .map((gridItem) => {
          if (gridItem.id === activeGridItem?.id) return gridItem;
          if (gridItem.startY === 0) return gridItem;
          if (isChanges) return gridItem;
          let minYPosition = 0;
          gridCopy
            .sort((a, b) => a.endY - b.endY)
            .forEach((gridElement, index) => {
              if (gridElement.id === gridItem.id) return;
              if (gridElement.endX < gridItem.startX || gridElement.startX > gridItem.endX) return;

              if (gridItem.startY < gridElement.startY) return;

              if (gridElement.id === activeGridItem?.id) {
                if (index > 0 && gridElement.startY - gridCopy[index - 1].endY > gridItem.height + 10) {
                  minYPosition = gridCopy[index - 1].endY + 10;
                  return;
                }
                if (index === 0 && gridElement.startY > gridItem.height + 10) {
                  minYPosition = 0;
                  return;
                }
              }

              minYPosition = gridElement.endY + 10;
            });

          if (minYPosition < gridItem.startY) {
            isChanges = true;
            return { ...gridItem, startY: minYPosition, endY: minYPosition + gridItem.height };
          }
          return gridItem;
        });
    } while (isChanges);
    return gridCopy;
  };

  const identifyElementsThatNeedToTranslateToBottom = (grid, activeGridItem) => {
    let elementsId = [];
    let isTouchBetweenElements = false;
    let startX = activeGridItem.startX;
    let endX = activeGridItem.endX;
    JSON.parse(JSON.stringify(grid))
      .sort((a, b) => a.startY - b.startY)
      .forEach((gridItem) => {
        if (gridItem.id === activeGridItem.id) return;
        if (gridItem.endY < activeGridItem.startY) return;
        if (gridItem.endX < startX || gridItem.startX > endX) return;
        if (
          (activeGridItem.startY >= gridItem.startY && activeGridItem.startY <= gridItem.endY) ||
          (activeGridItem.endY >= gridItem.startY && activeGridItem.endY <= gridItem.endY)
        ) {
          isTouchBetweenElements = true;
        }
        elementsId.push(gridItem.id);
        startX = startX > gridItem.startX ? gridItem.startX : startX;
        endX = endX < gridItem.endX ? gridItem.endX : endX;
      });
    return isTouchBetweenElements ? elementsId : [];
  };

  const changeGridElementsYPosition = (grid, gridItemsToChange, pxToAdd) => {
    return JSON.parse(JSON.stringify(grid))
      .sort((a, b) => a.startY - b.startY)
      .map((gridItem) => {
        if (gridItemsToChange.includes(gridItem.id)) {
          return {
            ...gridItem,
            startY: gridItem.startY + pxToAdd,
            endY: gridItem.endY + pxToAdd,
          };
        }
        return gridItem;
      });
  };
  return (
    <div className='drag__container'>
      {grid.map((n) => {
        return (
          <Draggable
            key={n.id}
            bounds='parent'
            position={{ x: n.startX, y: n.startY }}
            onStop={(e, position) => onStop(e, position, n.id)}
            onDrag={(e, position) => onControlledDrag(e, position, n.id)}
          >
            <div className='box'>
              My position can be changed programmatically. <br />I have a drag handler to sync state.
              <div>
                <div>ID:{n.id}</div>
                <div>StartX:{n.startX}</div>
                <div>StartY:{n.startY}</div>
                <div>endX:{n.endX}</div>
                <div>endY:{n.endY}</div>
                <div>Width:{n.width}</div>
                <div>Height:{n.height}</div>
                <div
                  className='add__btn'
                  onClick={() => {
                    setEl([...el, 'second' + grid.length]);
                  }}
                >
                  Add
                </div>
              </div>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};
