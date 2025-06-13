import { useMemo } from "react";

const StarsBackground = () => {
    const stars = useMemo(() =>
        Array.from({ length: 50 }, (_, i) => ({ 
            id: i,
            size: Math.random() * 2 + 1,
            top: Math.random() * 100,
            left: Math.random() * 100,
            opacity: Math.random() * 0.5 + 0.3,
        }))
        , [])

    return (
        <div className="absolute inset-0 z-0" aria-hidden="true">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                        opacity: star.opacity,
                    }}
                />
            ))}
        </div>
    )
}
export default StarsBackground;