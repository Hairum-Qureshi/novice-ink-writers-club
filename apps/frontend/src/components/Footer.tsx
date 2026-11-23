export default function Footer() {
	return (
		<footer className="bg-[#1b1b1b] h-50 p-10 text-center text-gray-200 font-alike-angular flex flex-col items-center justify-center">
			<hr className="border-slate-500 my-6 w-3/4" />
			<p>
				&copy; {new Date().getFullYear()} Novice Ink. Writer's Club. All rights
				reserved.
			</p>
		</footer>
	);
}
