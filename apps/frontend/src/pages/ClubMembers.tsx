import ClubMemberCard from "../components/ClubMemberCard";
import ClubFoundersJSON from "../json/club-founders.json";

export default function ClubMembers() {
	return (
		<div className="min-h-[calc(100vh-5rem)] w-full bg-[#172116] text-white">
			<h1 className="text-4xl text-center my-10 font-alike-angular text-yellow-400">
				Club Founders (2020-2022)
			</h1>
			<div className="w-3/4 m-auto">
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
		</div>
	);
}
