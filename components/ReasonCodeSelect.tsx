"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReasonCodeSelectProps {
	value: string;
	onChange: (value: string) => void;
	eventType: "Untagged" | "Offline" | "Logged" | string;
	className?: string;
}

const IDLE_CODES = ["Breakdown", "No Operator", "No Work / Material", "Tool Change", "Operator Break", "Machine Setup", "Quality Check"];

const OFFLINE_CODES = ["Power Loss", "MCB Trip", "Sensor Failure", "Network Issue", "Emergency Stop"];

export function ReasonCodeSelect({ value, onChange, eventType, className }: ReasonCodeSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Determine which codes to show based on event type
	const isOffline = eventType === "Offline";
	const codes = isOffline ? OFFLINE_CODES : IDLE_CODES;
	const categoryLabel = isOffline ? "Offline Codes" : "Idle Codes";

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (code: string) => {
		onChange(code);
		setIsOpen(false);
	};

	return (
		<div className={cn("relative", className)} ref={containerRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
					isOpen && "border-primary ring-2 ring-primary/20",
				)}
			>
				<span className={cn("truncate", !value && "text-gray-400 font-medium")}>{value || "Select a reason..."}</span>
				<span
					className={cn("material-symbols-outlined text-gray-400 !text-[18px] transition-transform duration-200", isOpen && "rotate-180")}
				>
					keyboard_arrow_down
				</span>
			</button>

			{isOpen && (
				<div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
					<div className="px-3 py-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider bg-gray-50/50">{categoryLabel}</div>
					<div className="p-1.5 space-y-0.5">
						{codes.map((code) => (
							<button
								key={code}
								type="button"
								onClick={() => handleSelect(code)}
								className={cn(
									"w-full text-left px-3 py-2 text-xs font-bold text-gray-700 rounded-md transition-colors hover:bg-gray-50",
									value === code && "bg-primary/5 text-primary",
								)}
							>
								{code}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
