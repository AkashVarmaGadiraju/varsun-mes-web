import React from "react";

const Loader = ({ className }: { className?: string }) => {
	return (
		<div className={`flex flex-col items-center justify-center p-8 gap-4 ${className}`}>
			<div className="flex space-x-2">
				<div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s] opacity-75"></div>
				<div className="size-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s] opacity-75"></div>
				<div className="size-3 bg-primary rounded-full animate-bounce opacity-75"></div>
			</div>
			<p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Loading Data</p>
		</div>
	);
};

export default Loader;
