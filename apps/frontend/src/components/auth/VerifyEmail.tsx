import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmail() {
	const navigate = useNavigate();
	const location = useLocation();
	const { verifyEmail, resendVerificationEmail: resendMutation } = useAuth();

	const initialEmail =
		typeof location.state?.email === "string" ? location.state.email : "";

	const [email, setEmail] = useState(initialEmail);
	const [emailInput, setEmailInput] = useState(initialEmail);
	const [enteringEmail, setEnteringEmail] = useState(false);
	const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
	const [timeLeft, setTimeLeft] = useState(0);

	const inputRef = useRef<(HTMLInputElement | null)[]>([]);

	const isCodeComplete = code.every(digit => digit !== "");

	useEffect(() => {
		if (timeLeft <= 0) return;

		const timeout = setTimeout(() => {
			setTimeLeft(prev => Math.max(0, prev - 1));
		}, 1000);

		return () => clearTimeout(timeout);
	}, [timeLeft]);

	useEffect(() => {
		if (email && !enteringEmail) {
			inputRef.current[0]?.focus();
		}
	}, [email, enteringEmail]);

	const handleCodeChange = (index: number, value: string) => {
		const digit = value.replace(/\D/g, "").slice(-1);

		setCode(prev => {
			const updated = [...prev];
			updated[index] = digit;
			return updated;
		});

		if (digit && index < CODE_LENGTH - 1) {
			inputRef.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "ArrowLeft" && index > 0) {
			e.preventDefault();
			inputRef.current[index - 1]?.focus();
		}

		if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
			e.preventDefault();
			inputRef.current[index + 1]?.focus();
		}

		if (e.key === "Backspace" && !code[index] && index > 0) {
			e.preventDefault();
			inputRef.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();

		const pastedCode = e.clipboardData
			.getData("text")
			.replace(/\D/g, "")
			.slice(0, CODE_LENGTH);

		if (!pastedCode) return;

		const updated = Array(CODE_LENGTH).fill("");

		pastedCode.split("").forEach((digit, index) => {
			updated[index] = digit;
		});

		setCode(updated);

		const nextIndex = Math.min(pastedCode.length, CODE_LENGTH - 1);

		inputRef.current[nextIndex]?.focus();
	};

	const handleResend = (recipient: string) => {
		const normalizedEmail = recipient.trim();

		if (!normalizedEmail || resendMutation.isPending) return;

		resendMutation.reset();
		resendMutation.mutate(normalizedEmail, {
			onSuccess: (_, sentEmail) => {
				setEmail(sentEmail);
				setEmailInput(sentEmail);
				setEnteringEmail(false);
				setCode(Array(CODE_LENGTH).fill(""));
				setTimeLeft(RESEND_COOLDOWN);
			}
		});
	};

	const handleVerify = () => {
		if (!isCodeComplete) return;

		verifyEmail.mutate(code.join(""), {
			onSuccess: () => navigate("/")
		});
	};

	return (
		<div className="flex h-full w-full max-w-md flex-col items-center justify-center">
			<h1 className="mb-3 text-2xl font-semibold">Verify Your Email</h1>
			{/* STATE 1: No email available */}
			{!email && !enteringEmail && (
				<div className="flex w-full flex-col items-center gap-4">
					<p className="text-center text-sm text-slate-500">
						Enter your email address to receive a verification code.
					</p>

					<button
						type="button"
						onClick={() => {
							resendMutation.reset();
							setEnteringEmail(true);
						}}
						className="rounded bg-novice-ink-blue px-4 py-2 text-sm text-white hover:cursor-pointer"
					>
						Request Verification Email
					</button>
				</div>
			)}
			{/* STATE 2: Entering email */}
			{enteringEmail && (
				<form
					className="flex w-full flex-col items-center gap-3"
					onSubmit={e => {
						e.preventDefault();
						handleResend(emailInput);
					}}
				>
					<p className="text-center text-sm text-slate-500">
						Enter your email address and we'll send you a verification code.
					</p>

					<label
						htmlFor="verification-email"
						className="text-sm text-slate-600"
					>
						Email address
					</label>

					<input
						id="verification-email"
						type="email"
						autoComplete="email"
						required
						value={emailInput}
						onChange={e => setEmailInput(e.target.value)}
						className="w-full rounded border border-gray-300 p-2"
					/>

					<button
						type="submit"
						disabled={resendMutation.isPending}
						className="rounded bg-novice-ink-blue px-4 py-2 text-sm text-white disabled:opacity-50"
					>
						{resendMutation.isPending ? "Sending..." : "Send Verification Code"}
					</button>

					{email && (
						<button
							type="button"
							disabled={resendMutation.isPending}
							onClick={() => {
								setEnteringEmail(false);
								resendMutation.reset();
							}}
							className="text-sm text-slate-600 hover:underline"
						>
							Back to code entry
						</button>
					)}
				</form>
			)}
			{/* STATE 3: Verification code */}
			{email && !enteringEmail && (
				<>
					<p className="my-2 text-center text-gray-600">
						We sent a code to{" "}
						<span className="font-semibold text-sky-600">{email}</span>!
					</p>

					<div className="flex gap-2">
						{code.map((digit, index) => (
							<input
								key={index}
								ref={el => {
									inputRef.current[index] = el;
								}}
								type="text"
								inputMode="numeric"
								pattern="[0-9]*"
								autoComplete={index === 0 ? "one-time-code" : "off"}
								maxLength={1}
								value={digit}
								onChange={e => handleCodeChange(index, e.target.value)}
								onKeyDown={e => handleKeyDown(index, e)}
								onPaste={handlePaste}
								aria-label={`Digit ${index + 1}`}
								className="mt-2 h-12 w-12 rounded border border-gray-300 p-2 text-center"
							/>
						))}
					</div>

					<button
						type="button"
						disabled={!isCodeComplete || verifyEmail.isPending}
						onClick={handleVerify}
						className="mt-6 w-full rounded-md bg-novice-ink-blue p-3 text-sm text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
					>
						{verifyEmail.isPending ? "Verifying..." : "Verify Email"}
					</button>

					<div className="mt-4 flex w-full flex-col items-center gap-2">
						<p className="text-center text-sm leading-relaxed text-slate-500">
							Didn't receive the email? Check your spam folder.
						</p>

						{timeLeft > 0 ? (
							<div className="flex flex-col items-center gap-2 text-center">
								<p className="text-sm text-slate-500">
									Request a new verification email in{" "}
									<span className="font-semibold text-slate-700">
										{timeLeft}s
									</span>
								</p>

								<p role="status" className="text-sm font-medium text-green-600">
									Verification email sent!
								</p>
							</div>
						) : (
							<button
								type="button"
								disabled={resendMutation.isPending}
								onClick={() => handleResend(email)}
								className="rounded text-sm font-medium text-blue-600 transition-colors hover:cursor-pointer hover:text-blue-700 hover:underline disabled:opacity-50"
							>
								{resendMutation.isPending
									? "Sending..."
									: "Request New Verification Email"}
							</button>
						)}

						<button
							type="button"
							onClick={() => {
								setEmailInput(email);
								setEnteringEmail(true);
								resendMutation.reset();
							}}
							className="text-sm text-slate-500 hover:text-blue-600 hover:underline"
						>
							Use a different email address
						</button>
					</div>
				</>
			)}
			{resendMutation.isError && (
				<p
					role="alert"
					className="mt-3 flex shrink-0 text-center text-sm text-red-600"
				>
					Unable to send a verification email. Please check your email address
					and try again.
				</p>
			)}
			{verifyEmail.isError && (
				<p role="alert" className="mt-3 text-center text-sm text-red-600">
					Unable to verify your email. Please check the code and try again.
				</p>
			)}
			<button
				type="button"
				onClick={() => navigate("/sign-in")}
				className="mt-4 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:cursor-pointer hover:bg-slate-100 hover:text-blue-600"
			>
				<FaArrowLeftLong className="h-4 w-4" />
				<span>Back to Login</span>
			</button>
		</div>
	);
}
