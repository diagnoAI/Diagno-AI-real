import React from 'react'
import "../styles/Slider.css"
import { motion } from 'framer-motion';

// Slider Component
const Slider = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container">
      <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {images.map((img, index) => (
          <div key={index} className="slide">
            {img ? <img src={img} alt={`Slide ${index + 1}`} className="slide-image" /> : <div className="slide-placeholder">Add Image {index + 1}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider