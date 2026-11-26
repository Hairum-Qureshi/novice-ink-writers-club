import { FaMagnifyingGlass } from "react-icons/fa6";
import UserCard from "../components/cards/UserCard";
import useUser from "../hooks/useUser";
import { useState } from "react";
import { BsSliders } from "react-icons/bs";
import { Role } from "@repo/shared-types";

export default function AllUsers() {
	const { getAllUsers } = useUser();
	const [searchTerm, setSearchTerm] = useState("");
	const [showFilterOptions, setShowFilterOptions] = useState(false);

	return (
		<div className="p-4 bg-[#1e2a22]">
			<div className="p-5 flex min-h-screen max-h-scroll items-center justify-center my-5 text-white">
				<div className="flex flex-col justify-center items-center w-7/12">
					<h5 className="uppercase text-sm text-yellow-400 my-2 font-alike-angular">
						The Novice Ink. Community
					</h5>
					<h1 className="text-4xl font-semibold font-alike-angular">
						All Novice Ink. Users
					</h1>
					<div className="relative flex items-center gap-3 w-full my-6 border border-green-200/20 bg-green-200/10 px-3 rounded-sm">
						<FaMagnifyingGlass className="text-green-200/50 shrink-0" />
						<input
							type="text"
							placeholder="Search users..."
							className="w-full py-2.5 bg-transparent outline-none"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
						<BsSliders
							className="text-green-200/50 shrink-0 hover:text-green-200 hover:cursor-pointer"
							onClick={() => setShowFilterOptions(!showFilterOptions)}
						/>
						{showFilterOptions && (
							<div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-md border border-green-200/20 bg-green-950 p-1.5 shadow-xl shadow-black/20">
								<div className="px-2.5 py-2">
									<p className="text-sm font-medium text-green-200">
										Filter by role
									</p>
									<p className="mt-0.5 text-xs text-green-200/40">
										Narrow down your search
									</p>
								</div>

								<div className="my-1 border-t border-green-200/10" />

								<ul className="flex flex-col gap-0.5">
									{Object.values(Role).map(role => (
										<li
											key={role}
											className="cursor-pointer rounded-sm px-2.5 py-2 text-sm capitalize text-green-200/60 transition-colors hover:bg-green-200/10 hover:text-green-200"
										>
											{role}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
					<div className="grid grid-cols-1 my-5 w-full">
						{getAllUsers.isPending ? (
							<h2 className="text-center text-white">Loading users...</h2>
						) : getAllUsers.isError ? (
							<h2 className="text-center text-white" role="alert">
								Unable to load users. Please try again later.
							</h2>
						) : !getAllUsers.data?.length ? (
							<h2 className="text-center text-white">No users found</h2>
						) : (
							getAllUsers.data.map(user => (
								<UserCard key={user.id} user={user} />
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
