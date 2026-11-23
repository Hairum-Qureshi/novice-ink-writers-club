export default function ClubMemberCard({
	name,
	role,
	contributions,
	imageUrl
}: {
	name: string;
	role: string;
	contributions: string;
	imageUrl: string;
}) {
	return (
		<div className="w-full max-w-3xl mx-auto my-4 p-5 bg-[#2b3628] border border-gray-600 rounded-xl transition-colors hover:border-gray-400">
			<div className="flex flex-col sm:flex-row gap-5">
				<img
					src={imageUrl}
					alt={name}
					className="w-32 h-32 sm:w-36 sm:h-36 shrink-0 object-cover rounded-lg border border-slate-500"
				/>
				<div className="flex flex-col justify-center gap-2">
					<div>
						<h2 className="text-xl font-bold text-white font-lusitana">
							{name}
						</h2>

						<span className="text-sm font-medium text-yellow-500 font-alike-angular">
							{role}
						</span>
					</div>

					<div className="w-12 h-px bg-gray-500" />

					<p className="text-sm sm:text-base text-gray-300 leading-relaxed font-lusitana">
						{contributions}
					</p>
				</div>
			</div>
		</div>
	);
}
