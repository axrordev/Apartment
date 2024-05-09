// import spinner from "../assets/svg/spinner.svg"
import BeatLoader from "react-spinners/BeatLoader";
const Spinner = () => {
	return (
		<div className="bg-white  flex items-center justify-center fixed left-0 bottom-0 right-0 top-0 ">
			<div>
				<BeatLoader color="rgb(240, 126, 73)" speedMultiplier={1} />
			</div>
		</div>
	);
};

export default Spinner;
