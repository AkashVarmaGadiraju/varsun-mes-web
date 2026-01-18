import React from "react";

interface NumberCounterProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	inputClassName?: string;
}

export function NumberCounter({ label, value, onChange, min = 0, inputClassName = "text-gray-800" }: NumberCounterProps) {
	return (
		<div className="space-y-1.5">
			<label className="block text-[11px] font-bold text-gray-500 uppercase ml-1">{label}</label>
			<div className="flex items-center h-9 bg-gray-50 !rounded-lg border border-gray-200 overflow-hidden">
				<button
					onClick={() => onChange(Math.max(min, value - 1))}
					className="w-8 h-full px-2 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 active:bg-gray-200 transition-colors border-r border-gray-200"
				>
					<span className="material-symbols-outlined !text-sm">remove</span>
				</button>
				<div className="flex-1 h-full bg-white flex items-center justify-center">
					<input
						className={`w-full text-center !text-xs font-bold border-none focus:ring-0 p-0 no-spin-button bg-transparent ${inputClassName}`}
						placeholder="0"
						type="number"
						value={value}
						onChange={(e) => onChange(Number(e.target.value))}
					/>
				</div>
				<button
					onClick={() => onChange(value + 1)}
					className="w-8 h-full px-2 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-100 active:bg-gray-200 transition-colors border-l border-gray-200"
				>
					<span className="material-symbols-outlined !text-sm">add</span>
				</button>
			</div>
		</div>
	);
}
