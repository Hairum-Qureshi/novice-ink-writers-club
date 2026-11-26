import type { SafeUser } from "@repo/shared-types";
import { Link } from "react-router-dom";

export default function UserCard({ user }: { user: SafeUser }) {
	return (
		<div className="p-4 border border-green-200/20 my-3 flex items-center flex-row bg-green-200/10 rounded-sm">
			<img
				src={user.profilePicture}
				alt="User Profile"
				className="w-16 h-16 rounded-full mb-2"
			/>
			<div className="ml-4">
				<Link
					to={`/user/${user.id}/profile`}
					className="text-lg hover:underline font-semibold text-green-200"
				>
					{user.firstName} {user.lastName}
				</Link>
				<h3>Role: {user.role}</h3>
				<h3>Date Joined: {new Date(user.createdAt).toLocaleDateString()}</h3>
			</div>
		</div>
	);
}
