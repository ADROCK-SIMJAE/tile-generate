import React, { useState } from "react";
import Draggable from "react-draggable";

const Admin = ({ onSave }) => {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const src = URL.createObjectURL(files[i]);
      newImages.push({ src, x: 0, y: 0 });
    }
    setImages(newImages);
  };

  const handleSave = () => {
    onSave(images);
  };

  const handleDrag = (index, e, data) => {
    const newImages = [...images];
    newImages[index].x = data.x;
    newImages[index].y = data.y;
    setImages(newImages);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageUpload} />
      <div
        style={{
          position: "relative",
          width: "1000px",
          height: "1000px",
          border: "1px solid black",
        }}
      >
        {images.map((image, index) => (
          <Draggable
            key={index}
            position={{ x: image.x, y: image.y }}
            onStop={(e, data) => handleDrag(index, e, data)}
          >
            <img
              src={image.src}
              alt={`img-${index}`}
              width={100}
              style={{ position: "absolute" }}
            />
          </Draggable>
        ))}
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Admin;
