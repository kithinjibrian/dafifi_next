import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';


export const FlowEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data = {},
    markerEnd,
}) => {
    // Generate the path for the Bezier curve
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Destructure edge configuration with defaults
    const {
        animated = false,
        dashed = false,
        gradientColors = ['#3182ce', '#52c41a'], // Default glow colors
        glowIntensity = 0.7, // Glow intensity
        label = '',
        labelStyle = {}
    } = data;

    // Create unique gradient and filter IDs
    const gradientId = `neon-gradient-${id}`;
    const filterId = `neon-glow-${id}`;

    return (
        <>
            {/* SVG Definitions for Gradient and Glow */}
            <svg style={{ zIndex: 100, position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    {/* Linear Gradient */}
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={gradientColors[0]} />
                        <stop offset="100%" stopColor={gradientColors[1]} />
                    </linearGradient>

                    {/* Glow Filter */}
                    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur
                            in="SourceGraphic"
                            stdDeviation="10"
                            result="blur"
                        />
                        <feColorMatrix
                            in="blur"
                            type="matrix"
                            values={`1 0 0 0 0 
                       0 1 0 0 0 
                       0 0 1 0 0 
                       0 0 0 ${glowIntensity} 0`}
                        />
                    </filter>
                </defs>
            </svg>

            {/* Glow Layer */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: `url(#${gradientId})`,
                    strokeWidth: 8, // Wider stroke for more pronounced glow
                    strokeDasharray: dashed ? '5 5' : 'none',
                    filter: `url(#${filterId})`,
                    opacity: 1,
                    animation: animated ? 'dashAnimation 1s linear infinite' : 'none',
                }}
            />

            {/* Core Edge Layer */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: `url(#${gradientId})`,
                    strokeWidth: 3,
                    strokeDasharray: dashed ? '5 5' : 'none',
                    animation: animated ? 'dashAnimation 1s linear infinite' : 'none',
                }}
            />

            {label && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            background: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            pointerEvents: 'all',
                            border: `1px solid ${glowColors[1]}`,
                            boxShadow: `0 0 10px rgba(${parseInt(glowColors[1].slice(1, 3), 16)}, ${parseInt(glowColors[1].slice(3, 5), 16)}, ${parseInt(glowColors[1].slice(5, 7), 16)}, 0.5)`,
                            animation: animated ? 'pulse 1.5s ease-in-out infinite' : 'none',
                            ...labelStyle
                        }}
                        className="nodrag"
                    >
                        {label}
                    </div>
                </EdgeLabelRenderer>
            )}

            {/* Global styles for animations */}
            <style jsx="true" global="true">{`
        @keyframes dashAnimation {
          to {
            stroke-dashoffset: -10;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
      `}</style>
        </>
    );
};