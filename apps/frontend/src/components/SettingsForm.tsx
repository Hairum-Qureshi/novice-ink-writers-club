import type { UserSettingsFormData } from "@repo/shared-types";
import { useForm } from "react-hook-form";
import useUser from "../hooks/useUser";
import { useAuthStore } from "../stores/auth.store";

export function SettingsForm() {
	const user = useAuthStore(state => state.user);
	const { updateUser } = useUser();

	const { register, handleSubmit } = useForm<UserSettingsFormData>({
		defaultValues: {
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			gender: user?.gender ?? "prefer not to say",
			grade: user?.grade ?? "prefer not to say",
			biography: user?.biography ?? ""
		}
	});

	return (
		<div className="w-full">
			<form
				className="space-y-4"
				onSubmit={handleSubmit(data => updateUser.mutate(data))}
			>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						First Name
					</label>
					<input
						type="text"
						className="mt-1 block w-full rounded-md border outline-none border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
						{...register("firstName")}
						defaultValue={user?.firstName ?? ""}
					/>
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700">
						Last Name
					</label>
					<input
						type="text"
						className="mt-1 block w-full rounded-md border outline-none border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
						{...register("lastName")}
						defaultValue={user?.lastName ?? ""}
					/>
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700">
						Gender
					</label>
					<select
						className="mt-1 block w-full rounded-md border outline-none border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
						{...register("gender")}
						defaultValue={user?.gender ?? "prefer not to say"}
					>
						<option value="">Select gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Prefer Not to Say</option>
					</select>
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700">
						Grade
					</label>
					<select
						className="mt-1 block w-full rounded-md border outline-none border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
						{...register("grade")}
						defaultValue={user?.grade ?? undefined}
					>
						<option value="">Select grade</option>
						<option value="freshman">Freshman</option>
						<option value="sophomore">Sophomore</option>
						<option value="junior">Junior</option>
						<option value="senior">Senior</option>
						<option value="prefer not to say">Prefer Not to Say</option>
					</select>
				</div>
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700">
						Biography
					</label>
					<textarea
						className="mt-1 h-20 min-h-15 max-h-30 block w-full rounded-md border outline-none border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
						{...register("biography")}
						defaultValue={user?.biography ?? ""}
					/>
				</div>
				<div className="mt-4">
					<button
						type="submit"
						disabled={updateUser.isPending}
						className="w-full rounded-md bg-novice-ink-blue px-4 py-3 text-white hover:bg-novice-ink-blue focus:outline-none sm:text-sm hover:cursor-pointer"
					>
						{updateUser.isPending ? "Saving..." : "Save Changes"}
					</button>
				</div>
				{updateUser.isError && (
					<p className="text-sm text-red-600" role="alert">
						Failed to save settings. Please try again.
					</p>
				)}
				{updateUser.isSuccess && (
					<p className="text-sm text-green-700" role="status">
						Settings saved successfully.
					</p>
				)}
			</form>
		</div>
	);
}
