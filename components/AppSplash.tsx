"use client";

import React, { useEffect, useState } from "react";
import Loader from "./Loader";

export default function AppSplash() {
	// Start with visible to block everything immediately
	const [isVisible, setIsVisible] = useState(true);
	const [opacity, setOpacity] = useState(1);

	useEffect(() => {
		const handleLoad = async () => {
			// Wait for fonts to be ready primarily, as that's the FOUC cause
			// @ts-ignore
			if (document.fonts) {
				try {
					// @ts-ignore
					await document.fonts.ready;
				} catch (e) {
					console.error("Font loading error", e);
				}
			}

			// Add a minimum delay for aesthetic purposes so it's not a jarring flash
			// and ensures react hydration is visually "hidden" until stable
			setTimeout(() => {
				setOpacity(0); // Trigger fade out
				setTimeout(() => {
					setIsVisible(false); // Remove from DOM
				}, 500); // Match transition duration
			}, 800);
		};

		// If document is already complete (e.g. navigation within app or fast load), trigger immediately
		if (document.readyState === "complete") {
			handleLoad();
		} else {
			window.addEventListener("load", handleLoad);
			// Safety fallback
			const timer = setTimeout(handleLoad, 3000);
			return () => {
				window.removeEventListener("load", handleLoad);
				clearTimeout(timer);
			};
		}
	}, []);

	if (!isVisible) return null;

	return (
		<div
			className="absolute inset-0 z-[9999] bg-[#f8fafb] flex items-center justify-center transition-opacity duration-500 ease-out"
			style={{ opacity: opacity }}
		>
			<Loader />
		</div>
	);
}
