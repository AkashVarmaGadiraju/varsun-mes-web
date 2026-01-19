"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReasonCodeSelect } from "@/components/ReasonCodeSelect";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import AppHeader from "@/components/AppHeader";
import SearchFilterBar from "@/components/SearchFilterBar";
import Loader from "@/components/Loader";

import { fetchDeviceList, type DeviceSummary } from "@/utils/scripts";

export default function MachineTaggingPage() {
	const router = useRouter();
	const params = useParams();
	const { currentDate, setCurrentDate, eventsDevices, setEventsDevices } = useData();
	// decodeURIComponent in case ID has spaces or special chars
	const machineId = typeof params.id === "string" ? decodeURIComponent(params.id) : "Unknown Machine";

	const lhtClusterId = process.env.NEXT_PUBLIC_LHT_CLUSTER_ID ?? "";
	const [isLoading, setIsLoading] = useState(!!lhtClusterId && eventsDevices.length === 0);

	// Fetch devices if not present
	React.useEffect(() => {
		if (!lhtClusterId) return;
		if (eventsDevices.length > 0) return;

		setIsLoading(true);
		fetchDeviceList({ clusterId: lhtClusterId })
			.then(setEventsDevices)
			.catch(console.error)
			.finally(() => setIsLoading(false));
	}, [lhtClusterId, eventsDevices.length, setEventsDevices]);

	const machineName = React.useMemo(() => {
		const device = eventsDevices.find((d) => d.id === machineId);
		return device?.deviceName || machineId;
	}, [eventsDevices, machineId]);

	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	// Mock Data State
	const [stats] = useState({
		untaggedCount: 45,
		untaggedUnit: "min",
		totalIdle: "2h 10m",
		totalOffline: "15",
		totalOfflineUnit: "min",
	});

	// Mock Events Data
	const [events] = useState([
		{ id: "ev-101", machineId: "CNC-01", date: currentDate, startTime: "10:30", endTime: "10:45", duration: "15m", type: "Untagged" },
		{ id: "ev-102", machineId: "LATHE-05", date: currentDate, startTime: "08:00", endTime: "08:20", duration: "20m", type: "Offline" },
		{
			id: "ev-103",
			machineId: "CNC-02",
			date: currentDate,
			startTime: "09:15",
			endTime: "09:45",
			duration: "30m",
			type: "Logged",
		},
		// History event to test date navigation
		{
			id: "ev-099",
			machineId: "CNC-01",
			date: "2025-01-01",
			startTime: "14:00",
			endTime: "14:20",
			duration: "20m",
			type: "Logged",
			reason: "Maintenance",
		},
	]);

	// Ensure conditional return is AFTER all hooks
	if (isLoading) {
		return (
			<div className="flex bg-background-dashboard min-h-screen items-center justify-center">
				<Loader />
			</div>
		);
	}

	// Filter Logic
	const filteredEvents = events.filter((e) => {
		const isDateMatch = e.date === currentDate;
		const isSearchMatch =
			e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(e.reason && e.reason.toLowerCase().includes(searchQuery.toLowerCase())) ||
			e.startTime.includes(searchQuery);

		return isDateMatch && isSearchMatch;
	});

	return (
		<div className="flex flex-col min-h-screen bg-background-dashboard font-display pb-24 text-slate-800">
			<AppHeader
				title={machineName}
				subtitle="DOWNTIME EVENTS"
				showDateNavigator={true}
				rightElement={
					<button
						onClick={() => router.back()}
						className="text-gray-500 font-bold text-xs uppercase hover:text-gray-700 active:scale-95 transition-transform"
					>
						Back
					</button>
				}
			/>

			<main className="!py-2 px-4 space-y-2 pb-24">
				{/* Stats Grid */}
				<section className="grid grid-cols-3 !gap-2">
					<div className="bg-white !rounded-lg border border-gray-100 shadow-sm !px-3 !py-1.5 flex flex-col justify-center items-start min-h-[52px]">
						<p className="!text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Untagged</p>
						<p className="text-xs font-bold text-gray-800 leading-tight">
							{stats.untaggedCount}
							{stats.untaggedUnit}
						</p>
					</div>
					<div className="bg-white !rounded-lg border border-gray-100 shadow-sm !px-3 !py-1.5 flex flex-col justify-center items-start min-h-[52px]">
						<p className="!text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Idle</p>
						<p className="text-xs font-bold text-gray-800 leading-tight">{stats.totalIdle}</p>
					</div>
					<div className="bg-white !rounded-lg border border-gray-100 shadow-sm !px-3 !py-1.5 flex flex-col justify-center items-start min-h-[52px]">
						<p className="!text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Offline</p>
						<p className="text-xs font-bold text-gray-800 leading-tight">
							{stats.totalOffline}
							{stats.totalOfflineUnit}
						</p>
					</div>
				</section>

				{/* Search Bar */}
				<div className="pb-1">
					<SearchFilterBar
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						placeholder="Search events..."
						showFilters={showFilters}
						onToggleFilters={() => setShowFilters(!showFilters)}
					/>
				</div>

				{/* Event List */}
				<div className="space-y-2">
					<div className="flex items-center justify-between px-1 mb-2">
						<h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Detected Events</h2>
						<span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">{filteredEvents.length} Events</span>
					</div>

					<div className="space-y-2">
						{filteredEvents.length > 0 ? (
							filteredEvents.map((event) => <EventCard key={event.id} event={event} machineId={machineId} />)
						) : (
							<div className="text-center py-12 flex flex-col items-center opacity-60">
								<span className="material-symbols-outlined text-[48px] text-gray-300 mb-2">event_busy</span>
								<p className="text-sm font-bold text-gray-400">No events found for this date</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

function EventCard({ event, machineId }: { event: any; machineId: string }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [reason, setReason] = useState(event.reason || "");

	const isUntagged = event.type === "Untagged";
	const isOffline = event.type === "Offline";
	const isLogged = event.type === "Logged";

	// Styles
	let containerClasses = "bg-white border-gray-200";
	let iconName = "check_circle";
	let iconBg = "bg-gray-100";
	let iconColor = "text-gray-400";
	let statusElement = <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Logged</span>;

	if (isUntagged) {
		containerClasses = "bg-orange-50/50 border-orange-200";
		iconName = "priority_high";
		iconBg = "bg-orange-100";
		iconColor = "text-orange-600";
		statusElement = <span className="text-orange-600 text-[10px] font-bold uppercase tracking-wider">Action</span>;
	} else if (isOffline) {
		containerClasses = "bg-red-50/50 border-red-200";
		iconName = "power_off";
		iconBg = "bg-red-100";
		iconColor = "text-red-500";
		statusElement = <span className="text-red-600 text-[10px] font-bold uppercase tracking-wider">Offline</span>;
	}

	return (
		<div
			className={cn(
				"rounded-xl border transition-all duration-200",
				containerClasses,
				isExpanded ? "shadow-md ring-1 ring-primary/5" : "shadow-sm",
			)}
		>
			{/* Card Header (Clickable) */}
			<div className="p-2 gap-2 flex cursor-pointer relative" onClick={() => setIsExpanded(!isExpanded)}>
				{/* Icon Box */}
				<div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0 self-center", iconBg, iconColor)}>
					<span className="material-symbols-outlined !text-[16px]">{iconName}</span>
				</div>

				{/* Middle Content */}
				<div className="flex-1 min-w-0 flex flex-col justify-center">
					<h3 className="text-sm font-bold font-display text-slate-800 truncate">
						{event.type}
						{isLogged && event.reason ? <span className="font-normal text-gray-500"> • {event.reason}</span> : ""}
					</h3>
					<p className="text-[10px] text-slate-500 font-medium truncate">
						{event.startTime} - {event.endTime} • {event.duration}
					</p>
				</div>

				{/* Right Column: Status & Toggle */}
				<div className="flex flex-col items-end justify-between self-stretch shrink-0 pl-1 py-1">
					{statusElement}

					<div className={cn("text-gray-400 transition-transform duration-200 leading-none", isExpanded && "rotate-180")}>
						<span className="material-symbols-outlined !text-[18px]">expand_more</span>
					</div>
				</div>
			</div>

			{/* Expanded Content (Form) */}
			{isExpanded && (
				<div className="bg-white border-t border-gray-100 px-4 py-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
					{/* Reason Code */}
					<div className="space-y-1.5">
						<label className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Reason Code</label>
						<ReasonCodeSelect value={reason} onChange={setReason} eventType={event.type} />
					</div>

					{/* Action Buttons */}
					<div className="flex justify-between items-center gap-2">
						<Link
							href={`/data/${encodeURIComponent(machineId)}/tag/${event.id}`}
							className="text-xs font-bold text-primary underline decoration-primary/30 hover:decoration-primary underline-offset-2"
						>
							Add more details
						</Link>
						<div className="flex gap-2">
							<button
								onClick={(e) => {
									e.stopPropagation();
									setIsExpanded(false);
								}}
								className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
							>
								CANCEL
							</button>
							<button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 active:scale-95 transition-all">
								SAVE
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
