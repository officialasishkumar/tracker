// components/custom-cursor.tsx
"use client";

import React, { useState, useEffect } from "react";
import "../components/css/custom-cursor.css"; // Adjust the path if necessary

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);

    // Update the cursor position on mouse move
    const handleMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    // Trigger click animation
    const handleMouseClick = () => {
        setClicked(true);
        setTimeout(() => setClicked(false), 300);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleMouseClick);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleMouseClick);
        };
    }, []);

    return (
        <div
            className={`custom-cursor ${clicked ? "clicked" : ""}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <img
                src="https://cdn.discordapp.com/attachments/1350528842393063514/1350528956805287986/tle-eliminators.png?ex=67d7119a&is=67d5c01a&hm=2393c346d6563687280b368136f417b1d6589e4f4c664514b33cee211940a3af&format=webp&quality=lossless" // Should load the image from public/tle-image.png
                alt="Custom Cursor"
                style={{ width: "40px", height: "40px", pointerEvents: "none" }}
            />
        </div>
    );
}
