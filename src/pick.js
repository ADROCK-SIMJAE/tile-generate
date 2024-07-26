import React, { useState, useEffect } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import useImage from "use-image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { motion } from "framer-motion";

// 더미 데이터 (서버에서 가져올 예정)
const imageData = [
  { src: process.env.PUBLIC_URL + "/123.jpeg", x: 5, y: 10 },
  { src: process.env.PUBLIC_URL + "/456.jpeg", x: 10, y: 20 },
  { src: process.env.PUBLIC_URL + "/789.jpeg", x: 15, y: 30 },
];

const initialZoom = 0; // 초기 줌 레벨
const minZoom = 0; // 최소 줌 레벨
const maxZoom = 10; // 최대 줌 레벨
const zoomStep = 0.1; // 줌 레벨 단계

const generateTileColors = (tileCountX, tileCountY) => {
  const colors = [];
  for (let i = 0; i < tileCountY; i++) {
    const rowColors = [];
    for (let j = 0; j < tileCountX; j++) {
      rowColors.push(`rgba(0,0,0,0)`);
    }
    colors.push(rowColors);
  }
  return colors;
};

const Tile = ({ columnIndex, rowIndex, style, data }) => {
  const { tileWidth, tileHeight, onClick, colors, selectedTile, images } = data;
  const color = colors[rowIndex][columnIndex];
  const isSelected =
    selectedTile &&
    selectedTile.row === rowIndex &&
    selectedTile.column === columnIndex;

  const image = images.find(
    (img) => img.x === columnIndex && img.y === rowIndex
  );

  return (
    <motion.div
      style={{
        ...style,
        backgroundColor: color,
        border: "1px solid black",
        boxSizing: "border-box",
        position: "relative",
      }}
      initial={{ scale: 1 }}
      animate={{ scale: isSelected ? 1.2 : 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(rowIndex, columnIndex)}
    >
      {image && <img src={image.src} alt="" style={{ width: "100%", height: "100%" }} />}
    </motion.div>
  );
};

const TileGrid = ({ tileCountX, tileCountY, onTileClick, selectedTile, images }) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const generatedColors = generateTileColors(tileCountX, tileCountY);
    setColors(generatedColors);
  }, [tileCountX, tileCountY]);

  const tileWidth = 20; // 각 타일의 너비 (px)
  const tileHeight = 30; // 각 타일의 높이 (px)

  const canvasWidth = window.innerWidth * 0.7;
  const canvasHeight = window.innerHeight * 0.7;

  const initialScale = Math.min(
    canvasWidth / (tileWidth * tileCountX),
    canvasHeight / (tileHeight * tileCountY)
  );

  return (
    <TransformWrapper
      initialScale={initialScale}
      minScale={Math.pow(2, minZoom)}
      maxScale={Math.pow(2, maxZoom)}
      limitToBounds={false}
      wheel={{
        step: zoomStep,
      }}
    >
      <TransformComponent>
        <div
          style={{
            width: canvasWidth,
            height: canvasHeight,
            margin: "auto",
            backgroundColor: "white",
          }}
        >
          <Grid
            columnCount={tileCountX}
            columnWidth={tileWidth}
            height={canvasHeight}
            rowCount={tileCountY}
            rowHeight={tileHeight}
            width={canvasWidth}
            itemData={{ tileWidth, tileHeight, onClick: onTileClick, colors, selectedTile, images }}
          >
            {Tile}
          </Grid>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};

const App = () => {
  const tileCountX = 20; // X축 타일 개수
  const tileCountY = 50; // Y축 타일 개수
  const [selectedTile, setSelectedTile] = useState(null);

  const handleTileClick = (rowIndex, columnIndex) => {
    setSelectedTile({ row: rowIndex, column: columnIndex });
    console.log(`Tile at row ${rowIndex}, column ${columnIndex} clicked`);
    // 서버로 데이터 전송
    // axios.post('path/to/your/server', { rowIndex, columnIndex })
    //   .then(response => console.log('Tile data sent to server:', response.data))
    //   .catch(error => console.error('Error sending tile data:', error));
  };

  return (
    <TileGrid
      tileCountX={tileCountX}
      tileCountY={tileCountY}
      onTileClick={handleTileClick}
      selectedTile={selectedTile}
      images={imageData}
    />
  );
};

export default App;
