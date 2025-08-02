import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
    setSelectedSize('');
  };

  // const getCardHeight = () => {
  //   const heights = ['h-72', 'h-80', 'h-64', 'h-76'];
  //   return heights[parseInt(product.id) % heights.length];
  // };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-full"
      >
        <div className="relative overflow-hidden h-64"> {/* Fixed height container */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg"
            >
              <Heart
                className={`h-5 w-5 transition-colors duration-300 ${
                  isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
                }`}
              />
            </motion.button>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{likes}</span>
            </div>
          </div>

          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>NEW</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
            <Star className="h-3 w-3 fill-current" />
            <span>{(4.2 + Math.random() * 0.7).toFixed(1)}</span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(product.price)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
              {formatPrice(product.price + 1000)}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-1">
              <span>Select Size</span>
              <motion.div
                animate={{ rotate: selectedSize ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ✨
              </motion.div>
            </label>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                    selectedSize === size
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            {isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </motion.button>
            ) : (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-3">
                <span>Login to add to cart</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>

  );
};

export default ProductCard;