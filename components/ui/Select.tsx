"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
	label: string;
	value: string;
}

interface SelectProps {
	value: string;
	onChange: (value: string) => void;
	options: (string | SelectOption)[];
	placeholder?: string;
	className?: string;
	label?: string;
}

export default function Select({ value, onChange, options, placeholder = "Select...", className, label }: SelectProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const normalizedOptions: SelectOption[] = React.useMemo(() => {
		return options.map((opt) => (typeof opt === "string" ? { label: opt, value: opt } : opt));
	}, [options]);

	const selectedOption = normalizedOptions.find((opt) => opt.value === value);

	return (
		<div className={cn("relative", className)} ref={containerRef}>
			{label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">{label}</label>}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"flex items-center justify-between w-full h-11 px-4 text-left bg-white border rounded-xl transition-all duration-200",
					isOpen ? "border-primary ring-2 ring-primary/10 shadow-sm" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
				)}
			>
				<span className={cn("text-[15px] font-medium truncate", !selectedOption ? "text-gray-400" : "text-gray-700")}>
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<span
					className={cn(
						"material-symbols-outlined text-gray-400 transition-transform duration-300 text-[20px]",
						isOpen && "rotate-180 text-primary",
					)}
				>
					keyboard_arrow_down
				</span>
			</button>

			{isOpen && (
				<div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
					<div className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent p-1.5">
						{normalizedOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className={cn(
									"flex items-center w-full px-3 py-2.5 text-[14px] font-medium rounded-lg transition-colors text-left",
									value === option.value ? "bg-primary/5 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
								)}
							>
								<span className="flex-1 truncate">{option.label}</span>
								{value === option.value && <span className="material-symbols-outlined text-[18px] text-primary">check</span>}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
