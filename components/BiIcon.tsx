
import React from 'react';
import { BITool } from '../types';
import { BarChart2, Activity, Zap, Database } from 'lucide-react';

interface BiIconProps {
  tool: BITool;
  size?: number;
  className?: string;
}

export const BiIcon: React.FC<BiIconProps> = ({ tool, size = 20, className = '' }) => {
  const getIcon = () => {
    switch (tool) {
      case 'Tableau':
        // White asterisk on blue bg usually, we will simulate with an icon
        return (
          <div className={`flex items-center justify-center rounded bg-[#E97627] text-white ${className}`} style={{ width: size, height: size }}>
            <span className="font-bold text-[10px]">T</span>
          </div>
        );
      case 'PowerBI':
        return (
          <div className={`flex items-center justify-center rounded bg-[#F2C811] text-black ${className}`} style={{ width: size, height: size }}>
            <BarChart2 size={size * 0.6} />
          </div>
        );
      case 'Qlik':
        return (
          <div className={`flex items-center justify-center rounded bg-[#009845] text-white ${className}`} style={{ width: size, height: size }}>
             <span className="font-bold text-[10px]">Q</span>
          </div>
        );
      case 'External':
        return (
          <div className={`flex items-center justify-center rounded bg-blue-600 text-white ${className}`} style={{ width: size, height: size }}>
            <Zap size={size * 0.6} />
          </div>
        );
      default:
        return <Database size={size} className="text-gray-400" />;
    }
  };

  return getIcon();
};