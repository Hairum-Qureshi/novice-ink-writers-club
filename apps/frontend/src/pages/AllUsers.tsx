import { FaMagnifyingGlass } from "react-icons/fa6";
import UserCard from "../components/UserCard";
import useUser from "../hooks/useUser";

export default function AllUsers() {
	const { getAllUsers } = useUser();

	return (
		<div className="p-4 min-h-[calc(100vh-5rem)] bg-[#1e2a22]">
			<div className="p-5 flex items-center justify-center my-5 text-white">
				<div className="flex flex-col justify-center items-center w-7/12">
					<h5 className="uppercase text-sm text-yellow-400 my-2 font-alike-angular">
						The Novice Ink. Community
					</h5>
					<h1 className="text-4xl font-semibold font-alike-angular">
						All Novice Ink. Users
					</h1>
					<div className="flex items-center gap-3 w-full my-6 border border-green-200/20 bg-green-200/10 px-3 rounded-sm">
						<FaMagnifyingGlass className="text-green-200/50 shrink-0" />
						<input
							type="text"
							placeholder="Search users..."
							className="w-full py-2.5 bg-transparent outline-none"
						/>
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
