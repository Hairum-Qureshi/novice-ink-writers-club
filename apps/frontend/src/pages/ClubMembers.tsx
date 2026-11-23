import ClubMemberCard from "../components/ClubMemberCard";
import ClubFoundersJSON from "../json/club-founders.json";
import ClubPhoto from "../public/assets/ClubPhoto.jpg";

export default function ClubMembers() {
	return (
		<div className="min-h-[calc(100vh-5rem)] w-full bg-[#172116] text-white px-4 py-10">
			<h1 className="text-4xl text-center mt-5 mb-10 font-alike-angular text-yellow-400">
				Club Founders (2020-2022)
			</h1>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
				{ClubFoundersJSON.map(founder => (
					<ClubMemberCard
						key={founder.name}
						name={founder.name}
						role={founder.role}
						contributions={founder.contributions}
						imageUrl={founder.photo}
					/>
				))}
			</div>
			<div>
				<img
					src={ClubPhoto}
					alt="Club Photo"
					className="w-full max-w-4xl mx-auto mt-10 rounded-lg border border-gray-600"
				/>
			</div>
		</div>
	);
}
