import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Modal } from "antd";

const getRandomRotation = () => Math.random() * 30 - 15;

export default function OverlappingImages({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const displayedImages = images.slice(0, 5);

  const imageTransforms = useMemo(() => {
    return displayedImages.map(() => ({
      rotate: getRandomRotation(),
      x: Math.random() * 30,
      y: Math.random() * 30,
    }));
  }, [displayedImages]);

  return (
    <div className="relative flex items-center">
      {displayedImages.map((src, index) => (
        <motion.img
          key={index}
          src={src}
          className="absolute w-12 h-12 top-[-1.5rem] shadow-2 rounded-md object-cover cursor-pointer"
          initial={{ rotate: imageTransforms[index].rotate }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setSelectedImage(src)}
          style={{
            left: `${index * -5}px`,
            zIndex: displayedImages.length - index,
          }}
        />
      ))}
      <Modal
        open={!!selectedImage}
        footer={null}
        onCancel={() => setSelectedImage(null)}
        centered
        width="50vw"
      >
        <div className="mt-5 w-full">
        <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-lg" />
        </div>
      </Modal>
    </div>
  );
}
