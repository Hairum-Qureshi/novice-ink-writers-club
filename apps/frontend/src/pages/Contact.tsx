export default function Contact() {
	return (
		<div className="min-h-[calc(100vh-5rem)] w-full bg-[#0e1b0c] text-white">
			<div className="mx-auto flex px-5 py-20 w-full max-w-2xl flex-col items-center">
				{/* Header */}
				<div className="mb-12 text-center">
					<h1 className="font-alike-angular text-4xl text-yellow-400 md:text-5xl">
						Contact Us
					</h1>
					<p className="mt-4 text-sm leading-relaxed font-alike-angular md:text-base">
						Hello. If you have any questions, comments, or concerns, please send
						us an email and we'll get back to you! Please be sure to checkout
						the FAQ at the bottom of the home page to see if your question has
						already been answered. Thank you! We look forward to hearing from
						you.
					</p>
				</div>

				{/* Contact Form */}
				<form className="w-full space-y-6">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<label
								htmlFor="name"
								className="text-sm font-alike-angular font-medium text-white/80"
							>
								Your Name
							</label>
							<input
								type="text"
								id="name"
								name="name"
								placeholder="Enter your name"
								autoComplete="name"
								required
								className={
									"w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors duration-200 focus:border-yellow-400 focus:bg-white/10 font-alike-angular"
								}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="email"
								className="text-sm font-alike-angular font-medium text-white/80"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="Enter your email"
								autoComplete="email"
								required
								className={
									"w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors duration-200 focus:border-yellow-400 focus:bg-white/10 font-alike-angular"
								}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="message"
							className="text-sm font-alike-angular font-medium text-white/80"
						>
							Your Message
						</label>
						<textarea
							id="message"
							name="message"
							rows={6}
							placeholder="Write your message here..."
							required
							className={
								"w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-colors duration-200 focus:border-yellow-400 focus:bg-white/10 resize-y font-alike-angular"
							}
						/>
					</div>
					<button
						type="submit"
						className="w-full cursor-pointer rounded-lg bg-yellow-400 px-3 my-5 py-3 font-semibold text-[#0e1b0c] transition-colors duration-200 hover:bg-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 font-alike-angular"
						onClick={() => alert("This feature is no longer in service")}
					>
						Send Message
					</button>
				</form>
			</div>
			<div className="h-1/2 flex items-center border-t border-amber-300 p-20 justify-center flex-col bg-[#1d2c1a]">
				<h1 className="text-4xl font-bold text-white mb-4 font-alike-angular">
					Consider Joining Our Newsletter!
				</h1>
				<p className="text-white/80 text-center font-alike-angular w-1/2 my-5">
					Please consider joining our newsletter to obtain emails on what's new
					with the club! Your email will be sent as soon as you press
					"Subscribe".
				</p>
				<div className="my-5 w-1/2 flex overflow-hidden rounded-lg border border-white/15 bg-white/5 transition-colors duration-200 focus-within:border-yellow-400">
					<input
						type="email"
						placeholder="Enter your email"
						required
						className="min-w-0 flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/40 outline-none font-alike-angular"
					/>
					<button
						type="submit"
						className="shrink-0 cursor-pointer bg-yellow-400 px-6 py-3 font-alike-angular font-semibold text-[#0e1b0c] transition-colors duration-200 hover:bg-yellow-300"
						onClick={() => alert("This feature is no longer in service")}
					>
						Subscribe
					</button>
				</div>
			</div>
		</div>
	);
}
