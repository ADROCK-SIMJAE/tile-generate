import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// 예제 이미지 데이터 (하드코딩된 위치와 크기)
const exampleImages = [
  {
    src: process.env.PUBLIC_URL + "/123.jpeg",
    x: 3,
    y: 2,
    width: 10,
    height: 15,
  },
  {
    src: process.env.PUBLIC_URL + "/123.jpeg",
    x: 20,
    y: 25,
    width: 10,
    height: 15,
  },
  {
    src: process.env.PUBLIC_URL + "/123.jpeg",
    x: 50,
    y: 60,
    width: 10,
    height: 15,
  },
];

const minZoom = 0.1; // 최소 줌 레벨 (전체가 보이는 정도)
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

const Tile = ({ x, y, width, height, color, onClick, isSelected }) => (
  <Rect
    x={x}
    y={y}
    width={width}
    height={height}
    fill={isSelected ? "pink" : color}
    stroke="black"
    strokeWidth={1}
    onClick={onClick}
  />
);

const TileImage = ({ x, y, width, height, src }) => {
  const img = new window.Image();
  img.src = src;

  return <KonvaImage x={x} y={y} width={width} height={height} image={img} />;
};

const TileGrid = ({
  tileCountX,
  tileCountY,
  onTileClick,
  selectedTile,
  images,
}) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const generatedColors = generateTileColors(tileCountX, tileCountY);
    setColors(generatedColors);
  }, [tileCountX, tileCountY]);

  const tileWidth = 20; // 각 타일의 너비 (px)
  const tileHeight = 20; // 각 타일의 높이 (px)

  const canvasWidth = tileWidth * tileCountX;
  const canvasHeight = tileHeight * tileCountY;

  return (
    <TransformWrapper
      initialScale={minZoom}
      minScale={minZoom}
      maxScale={maxZoom}
      limitToBounds={false}
      wheel={{
        step: zoomStep,
      }}
    >
      <TransformComponent>
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>
            {images.map((image, index) => (
              <TileImage
                key={index}
                x={image.x * tileWidth}
                y={image.y * tileHeight}
                width={image.width * tileWidth}
                height={image.height * tileHeight}
                src={image.src}
              />
            ))}
            {colors.map((row, rowIndex) =>
              row.map((color, columnIndex) => (
                <Tile
                  key={`${rowIndex}-${columnIndex}`}
                  x={columnIndex * tileWidth}
                  y={rowIndex * tileHeight}
                  width={tileWidth}
                  height={tileHeight}
                  color={color}
                  onClick={() => onTileClick(rowIndex, columnIndex)}
                  isSelected={
                    selectedTile &&
                    selectedTile.row === rowIndex &&
                    selectedTile.column === columnIndex
                  }
                />
              ))
            )}
          </Layer>
        </Stage>
      </TransformComponent>
    </TransformWrapper>
  );
};

const App = () => {
  const tileCountX = 100; // X축 타일 개수
  const tileCountY = 100; // Y축 타일 개수
  const [selectedTile, setSelectedTile] = useState(null);
  const [images] = useState(exampleImages);

  const handleTileClick = (rowIndex, columnIndex) => {
    setSelectedTile({ row: rowIndex, column: columnIndex });
    alert(`Tile at row ${rowIndex}, column ${columnIndex} clicked`);
    // 서버로 데이터 전송
    // axios.post('path/to/your/server', { rowIndex, columnIndex })
    //   .then(response => console.log('Tile data sent to server:', response.data))
    //   .catch(error => console.error('Error sending tile data:', error));
  };

  return (
    <>
      <TileGrid
        tileCountX={tileCountX}
        tileCountY={tileCountY}
        onTileClick={handleTileClick}
        selectedTile={selectedTile}
        images={images}
      />
    </>
  );
};

export default App;
